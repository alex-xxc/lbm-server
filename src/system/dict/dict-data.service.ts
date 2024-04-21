import { Injectable, Req, ExecutionContext } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { genSalt, hash, compare, genSaltSync, hashSync } from 'bcryptjs';

import { DictDataEntity } from './entities/dict-data.entity'

import { ResultData } from '../../common/utils/result'
import { AppHttpCode } from '../../common/enums/code.enum'

import { CreateDictDataDto } from './data-dto/create-dict.dto'
import { UpdateDictDataDto } from './data-dto/update-dict.dto'
import { FindDictDataListDto } from './data-dto/find-dict-list.dto'

import { OperalogService } from 'src/system/operalog/operalog.service'

@Injectable()
export class DictDataService {
  constructor(
    @InjectRepository(DictDataEntity)
    private readonly dictRepo: Repository<DictDataEntity>,
    @InjectEntityManager()
    private readonly dictManager: EntityManager,
    private readonly operalogService: OperalogService,
  ) {}

  async findOneById(id: string): Promise<DictDataEntity> {
    let dict = await this.dictRepo.findOne({ where: { id } })
    dict = plainToInstance(DictDataEntity, { ...dict }, { enableImplicitConversion: true })
    return dict
  }

  async findOneByType(dictType: string): Promise<DictDataEntity> {
    let dict = await this.dictRepo.findOne({ where: { dictType } })
    dict = plainToInstance(DictDataEntity, { ...dict }, { enableImplicitConversion: true })
    return dict
  }

  async findOneDictType(dictValue: string): Promise<Boolean> {
    let dict = await this.dictRepo.findOne({ where: { dictValue } });
    let isRepeat = true
    if (dict) {
      isRepeat = true
    } else {
      isRepeat = false
    }
    return isRepeat;
  }

  /** 创建字典 */
  async create(createDictDataDto: CreateDictDataDto, account: String, ip: String) {
    // 防止id重复创建
    const salt = await genSalt()
    const dict = plainToInstance(DictDataEntity, { salt, ...createDictDataDto }, { ignoreDecorators: true })
    // 检测字典类型是否重复
    const isRepeat = await this.findOneDictType(createDictDataDto.dictValue);
    if (isRepeat) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '已有重复的字典键值')
    /** 创建字典 */
    const result = await this.dictManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<DictDataEntity>(dict)
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    /** 创建字典成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '字典',
      operaModule: `添加字典数据 -【${createDictDataDto.dictLabel}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询字典分页查询 */
  async findList(dto: FindDictDataListDto) {
    const { page, size, status, dictLabel, dictValue, dictType } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(dictLabel ? { dictLabel: Like(`%${dictLabel}%`) } : null),
      ...(dictValue ? { dictValue: Like(`%${dictValue}%`) } : null),
      ...(dictType ? { dictType: dictType } : null),
      isDelete: 1
    }
    const dict = await this.dictRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(dict[0]), total: dict[1] })
  }

  /** 查询字典信息 */
  async findOne(id: string) {
    const dict = await this.findOneById(id)
    if (!dict) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该字典不存在或已删除')
    return ResultData.ok(instanceToPlain(dict))
  }

  /** 更新字典 */
  async update(updateDictDataDto: UpdateDictDataDto, account: String, ip: String) {
    /** 查询字典时候存在 */
    const existing = await this.findOneById(updateDictDataDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该字典不存在或已删除');
    /** 更新字典 */
    const dictInfo = instanceToPlain(updateDictDataDto)
    const { affected } = await this.dictManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<DictDataEntity>(DictDataEntity, updateDictDataDto.id, dictInfo)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新字典成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '字典',
      operaModule: `更新字典 -【${updateDictDataDto.dictLabel}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok();
  }

  /** 更新字典状态 */
  async updateStatus(dictId: string, status: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询字典是否存在 */
    const existing = await this.findOneById(dictId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前字典不存在或已删除')
    /** 更新字典状态 */
    const { affected } = await this.dictManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<DictDataEntity>(DictDataEntity, dictId, { id: dictId, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');

    /** 更新字典状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '字典',
      operaModule: `更新字典数据状态 -【${existing.dictLabel}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 逻辑删除字典 */
  async updateDelete(dictId: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询字典是否存在 */
    const existing = await this.findOneById(dictId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前字典数据不存在或已删除')
    /** 逻辑删除字典 */
    const { affected } = await this.dictManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<DictDataEntity>(DictDataEntity, dictId, { id: dictId, isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');

    /** 逻辑删除字典成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '字典',
      operaModule: `删除字典数据 -【${existing.dictLabel}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }
}

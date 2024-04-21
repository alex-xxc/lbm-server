import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { genSalt } from 'bcryptjs';

import { DictEntity } from './entities/dict.entity';
import { DictDataEntity } from './entities/dict-data.entity';

import { ResultData } from '../../common/utils/result';
import { AppHttpCode } from '../../common/enums/code.enum';

import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { FindDictListDto } from './dto/find-dict-list.dto';

import { OperalogService } from 'src/system/operalog/operalog.service';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(DictEntity)
    private readonly dictRepo: Repository<DictEntity>,
    @InjectRepository(DictDataEntity)
    private readonly dictDataRepo: Repository<DictDataEntity>,
    @InjectEntityManager()
    private readonly dictManager: EntityManager,
    private readonly operalogService: OperalogService,
  ) {}

  async findOneById(id: string): Promise<DictEntity> {
    let dict = await this.dictRepo.findOne({ where: { id } })
    dict = plainToInstance(DictEntity, { ...dict }, { enableImplicitConversion: true })
    return dict
  }

  async findOneByType(dictType: string): Promise<DictEntity> {
    let dict = await this.dictRepo.findOne({ where: { dictType } })
    dict = plainToInstance(DictEntity, { ...dict }, { enableImplicitConversion: true })
    return dict
  }

  async findOneDictType(dictType: string): Promise<Boolean> {
    let dict = await this.dictRepo.findOne({ where: { dictType } });
    let isRepeat = true
    if (dict) {
      isRepeat = true
    } else {
      isRepeat = false
    }
    return isRepeat;
  }

  /** 创建字典 */
  async create(createDictDto: CreateDictDto, account: String, ip: String) {
    const dict = plainToInstance(DictEntity, { ...createDictDto }, { ignoreDecorators: true })
    // 检测字典类型是否重复
    const isRepeat = await this.findOneDictType(createDictDto.dictType);
    if (isRepeat) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '已有重复的字典类型')
    /** 创建字典 */
    const result = await this.dictManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<DictEntity>(dict)
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');

    /** 创建字典成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '字典',
      operaModule: `添加字典 -【${createDictDto.dictName}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询字典分页查询 */
  async findList(dto: FindDictListDto) {
    const { page, size, status, dictName, dictType } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(dictName ? { dictName: Like(`%${dictName}%`) } : null),
      ...(dictType ? { dictType: Like(`%${dictType}%`) } : null),
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

  /** 根据类型查询字典信息，方便全局用字典类型查询字典相关信息 */
  async findOneInfo(dictType: string) {
    const dict = await this.findOneByType(dictType)
    if (!dict) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该字典不存在或已删除');

    let dataList = {
      dataList: []
    }

    const dictDataList = await this.dictDataRepo.findAndCount({
      where: {
        dictType: dictType
      }
    })
    dataList.dataList = dictDataList[0]
    let data = { ...dict, ...dataList }
    return ResultData.ok(instanceToPlain(data))
  }

  /** 更新字典 */
  async update(updateDictDto: UpdateDictDto, account: String, ip: String) {
    /** 查询当前字典存不存在 */
    const existing = await this.findOneById(updateDictDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该字典不存在或已删除');
    /** 更新字典 */
    const dictInfo = instanceToPlain(updateDictDto)
    const { affected } = await this.dictManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<DictEntity>(DictEntity, updateDictDto.id, dictInfo)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新字典成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '字典',
      operaModule: `更新字典 -【${updateDictDto.dictName}】`,
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
      return await transactionalEntityManager.update<DictEntity>(DictEntity, dictId, { id: dictId, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');
    
    /** 更新字典状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '字典',
      operaModule: `更新字典状态 -【${existing.dictName}】`,
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
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前字典不存在或已删除')
    /** 逻辑删除字典 */
    const { affected } = await this.dictManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<DictEntity>(DictEntity, dictId, { id: dictId, isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');
    
    /** 逻辑删除字典成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '字典',
      operaModule: `删除字典 -【${existing.dictName}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  remove(id: number) {
    return `This action removes a #${id} dict`;
  }
}

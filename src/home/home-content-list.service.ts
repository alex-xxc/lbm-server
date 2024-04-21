import { Injectable, Req, ExecutionContext } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { genSalt, hash, compare, genSaltSync, hashSync } from 'bcryptjs';

import { HomeContentListEntity } from './entities/home-content-list.entity';

import { ResultData } from '../common/utils/result';
import { AppHttpCode } from '../common/enums/code.enum';

import { CreateHomeConentListDto } from './home-content-list-dto/create.dto';
import { UpdateListDto } from './home-content-list-dto/update.dto';
import { FindListDto } from './home-content-list-dto/find-list.dto';

import { OperalogService } from 'src/system/operalog/operalog.service';

@Injectable()
export class HomeContentListService {
  constructor(
    @InjectRepository(HomeContentListEntity)
    private readonly homeContentListRepo: Repository<HomeContentListEntity>,
    @InjectEntityManager()
    private readonly homeContentListManager: EntityManager,
    private readonly operalogService: OperalogService,
  ) {}

  async findOneById(id: string): Promise<HomeContentListEntity> {
    let data = await this.homeContentListRepo.findOne({ where: { id } })
    data = plainToInstance(HomeContentListEntity, { ...data }, { enableImplicitConversion: true })
    return data
  }

  /** 创建自定义AI内容列表 */
  async create(createHomeConentListDto: CreateHomeConentListDto, account: String, ip: String) {
    // 防止id重复创建
    const salt = await genSalt()
    const data = plainToInstance(HomeContentListEntity, { salt, ...createHomeConentListDto }, { ignoreDecorators: true })
    /** 创建自定义AI内容列表 */
    const result = await this.homeContentListManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<HomeContentListEntity>(data)
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    /** 创建自定义AI内容列表成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '自定义AI内容列表',
      operaModule: `添加自定义AI内容列表数据 -【${createHomeConentListDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询自定义AI内容列表分页查询 */
  async findList(dto: FindListDto) {
    const { page, size, status, title, contentCode } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(title ? { title: Like(`%${title}%`) } : null),
      ...(contentCode ? { contentCode: Like(`%${contentCode}%`) } : null),
      isDelete: 1
    }
    const dict = await this.homeContentListRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(dict[0]), total: dict[1] })
  }

  /** 查询自定义AI内容列表信息 */
  async findOne(id: string) {
    const dict = await this.findOneById(id)
    if (!dict) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该自定义AI内容列表不存在或已删除')
    return ResultData.ok(instanceToPlain(dict))
  }

  /** 更新自定义AI内容列表 */
  async update(updateListDto: UpdateListDto, account: String, ip: String) {
    /** 查询自定义AI内容列表时候存在 */
    const existing = await this.findOneById(updateListDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该自定义AI内容列表不存在或已删除');
    /** 更新自定义AI内容列表 */
    const info = instanceToPlain(updateListDto)
    const { affected } = await this.homeContentListManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<HomeContentListEntity>(HomeContentListEntity, updateListDto.id, info)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新自定义AI内容列表成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '自定义AI内容列表',
      operaModule: `更新自定义AI内容列表 -【${updateListDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok();
  }

  /** 更新自定义AI内容列表列表状态 */
  async updateStatus(id: string, status: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询自定义AI内容列表是否存在 */
    const existing = await this.findOneById(id)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前自定义AI内容列表不存在或已删除')
    /** 更新自定义AI内容列表状态 */
    const { affected } = await this.homeContentListManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<HomeContentListEntity>(HomeContentListEntity, id, { id: id, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');

    /** 更新自定义AI内容列表状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '自定义AI内容列表',
      operaModule: `更新自定义AI内容列表数据状态 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 逻辑删除自定义AI内容列表 */
  async updateDelete(id: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询自定义AI内容列表是否存在 */
    const existing = await this.findOneById(id)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前自定义AI内容列表数据不存在或已删除')
    /** 逻辑删除自定义AI内容列表 */
    const { affected } = await this.homeContentListManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<HomeContentListEntity>(HomeContentListEntity, id, { id: id, isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');

    /** 逻辑删除自定义AI内容列表成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '自定义AI内容列表',
      operaModule: `删除自定义AI内容列表数据 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }
}

import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import { HomeContentEntity } from './entities/home-content.entity';
import { HomeContentListEntity } from './entities/home-content-list.entity';

import { ResultData } from '../common/utils/result';
import { AppHttpCode } from '../common/enums/code.enum';

import { CreateHomeContentDto } from './home-content-dto/create.dto';
import { UpdateHomeContentDto } from './home-content-dto/update.dto';
import { FindHomeContentListDto } from './home-content-dto/find-list.dto';

import { OperalogService } from 'src/system/operalog/operalog.service';

@Injectable()
export class HomeContentService {
  constructor(
    @InjectRepository(HomeContentEntity)
    private readonly homeContentRepo: Repository<HomeContentEntity>,
    @InjectRepository(HomeContentListEntity)
    private readonly homeContentListRepo: Repository<HomeContentListEntity>,
    @InjectEntityManager()
    private readonly homeContentManager: EntityManager,
    private readonly operalogService: OperalogService,
  ) {}

  async findOneById(id: string): Promise<HomeContentEntity> {
    let homeContent = await this.homeContentRepo.findOne({ where: { id } })
    homeContent = plainToInstance(HomeContentEntity, { ...homeContent }, { enableImplicitConversion: true })
    return homeContent
  }

  async findOneByType(code: string): Promise<HomeContentEntity> {
    let homeContent = await this.homeContentRepo.findOne({ where: { code } })
    homeContent = plainToInstance(HomeContentEntity, { ...homeContent }, { enableImplicitConversion: true })
    return homeContent
  }

  async findOneContentType(code: string): Promise<Boolean> {
    let info = await this.homeContentRepo.findOne({ where: { code } });
    let isRepeat = true
    if (info) {
      isRepeat = true
    } else {
      isRepeat = false
    }
    return isRepeat;
  }

  /** 创建自定义AI内容 */
  async create(createContentDto: CreateHomeContentDto, account: String, ip: String) {
    const homeContent = plainToInstance(HomeContentEntity, { ...createContentDto }, { ignoreDecorators: true })
    // 检测自定义AI内容类型是否重复
    const isRepeat = await this.findOneContentType(createContentDto.code);
    if (isRepeat) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '已有重复的自定义AI内容类型')
    /** 创建自定义AI内容 */
    const result = await this.homeContentManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<HomeContentEntity>(homeContent)
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');

    /** 创建自定义AI内容成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '自定义AI内容',
      operaModule: `添加自定义AI内容 -【${createContentDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询自定义AI内容分页查询 */
  async findList(dto: FindHomeContentListDto) {
    const { page, size, status, title, code } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(title ? { title: Like(`%${title}%`) } : null),
      ...(code ? { code: Like(`%${code}%`) } : null),
      isDelete: 1
    }
    const info = await this.homeContentRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(info[0]), total: info[1] })
  }

  /** 查询自定义AI内容信息 */
  async findOne(id: string) {
    const info = await this.findOneById(id)
    if (!info) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该自定义AI内容不存在或已删除')
    return ResultData.ok(instanceToPlain(info))
  }

  /** 根据类型查询自定义AI内容信息，方便全局用自定义AI内容类型查询自定义AI内容相关信息 */
  async findOneInfo(contentCode: string) {
    const homeContent = await this.findOneByType(contentCode)
    if (!homeContent) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该自定义AI内容不存在或已删除');

    let dataList = {
      dataList: []
    }

    const homeContentList = await this.homeContentListRepo.findAndCount({
      where: {
        contentCode: contentCode
      }
    })
    dataList.dataList = homeContentList[0]
    let data = { ...homeContent, ...dataList }
    return ResultData.ok(instanceToPlain(data))
  }

  /** 更新自定义AI内容 */
  async update(updateContentDto: UpdateHomeContentDto, account: String, ip: String) {
    /** 查询当前自定义AI内容存不存在 */
    const existing = await this.findOneById(updateContentDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该自定义AI内容不存在或已删除');
    /** 更新自定义AI内容 */
    const info = instanceToPlain(updateContentDto)
    const { affected } = await this.homeContentManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<HomeContentEntity>(HomeContentEntity, updateContentDto.id, info)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新自定义AI内容成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '自定义AI内容',
      operaModule: `更新自定义AI内容 -【${updateContentDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok();
  }

  /** 更新自定义AI内容状态 */
  async updateStatus(id: string, status: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询自定义AI内容是否存在 */
    const existing = await this.findOneById(id)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前自定义AI内容不存在或已删除')
    /** 更新自定义AI内容状态 */
    const { affected } = await this.homeContentManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<HomeContentEntity>(HomeContentEntity, id, { id: id, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');
    
    /** 更新自定义AI内容状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '自定义AI内容',
      operaModule: `更新自定义AI内容状态 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 逻辑删除自定义AI内容 */
  async updateDelete(id: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询自定义AI内容是否存在 */
    const existing = await this.findOneById(id)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前自定义AI内容不存在或已删除')
    /** 逻辑删除自定义AI内容 */
    const { affected } = await this.homeContentManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<HomeContentEntity>(HomeContentEntity, id, { id: id, isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');
    
    /** 逻辑删除自定义AI内容成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '自定义AI内容',
      operaModule: `删除自定义AI内容 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }
}

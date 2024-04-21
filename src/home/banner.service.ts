import { Injectable, Req, ExecutionContext } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { genSalt } from 'bcryptjs';

import { BannerEntity } from './entities/banner.entity';

import { ResultData } from '../common/utils/result';
import { AppHttpCode } from '../common/enums/code.enum';

import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FindBannerListDto } from './dto/find-banner-list.dto';

import { OperalogService } from 'src/system/operalog/operalog.service';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepo: Repository<BannerEntity>,
    @InjectEntityManager()
    private readonly bannerManager: EntityManager,
    private readonly operalogService: OperalogService,
  ) {}

  async findOneById(id: string): Promise<BannerEntity> {
    let banner = await this.bannerRepo.findOne({ where: { id } })
    banner = plainToInstance(BannerEntity, { ...banner }, { enableImplicitConversion: true })
    return banner
  }

  /** 创建banner */
  async create(createBannerDto: CreateBannerDto, account: String, ip: String) {
    /** 创建banner */
    const banner = plainToInstance(BannerEntity, { ...createBannerDto }, { ignoreDecorators: true })
    const result = await this.bannerManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<BannerEntity>(banner)
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    /** 成功后添加操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '首页-banner',
      operaModule: `添加首页banner -【${createBannerDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询banner分页查询 */
  async findList(dto: FindBannerListDto) {
    const { page, size, status, title } = dto;  
    const where = {
      ...(status ? { status } : null),
      ...(title ? { title: Like(`%${title}%`) } : null),
      isDelete: 1
    }
    
    const banner = await this.bannerRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(banner[0]), total: banner[1] })
  }

  /** 查询banner所有 */
  async findAllList() {
    const where = {
      status: 1,
      isDelete: 1
    }
    const banner = await this.bannerRepo.findAndCount({
      where,
      order: { id: 'DESC' }
    })
    return ResultData.ok({ list: instanceToPlain(banner[0]), total: banner[1] })
  }

  /** 查询banner信息 */
  async findOne(id: string) {
    const banner = await this.findOneById(id)
    if (!banner) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该banner不存在或已删除')
    return ResultData.ok(instanceToPlain(banner))
  }

  /** 更新banner */
  async update(updateBannerDto: UpdateBannerDto, account: String, ip: String) {
    /** 查询banner是否存在 */
    const existing = await this.findOneById(updateBannerDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该banner不存在或已删除');
    /** 更新banner */
    const bannerInfo = instanceToPlain(updateBannerDto)
    const { affected } = await this.bannerManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<BannerEntity>(BannerEntity, updateBannerDto.id, bannerInfo)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新banner成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '首页-banner',
      operaModule: `更新首页banner -【${updateBannerDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok();
  }

  /** 更新banner状态 */
  async updateStatus(bannerId: string, status: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询banner是否存在 */
    const existing = await this.findOneById(bannerId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前banner不存在或已删除')

    /** 更新banner状态 */
    const { affected } = await this.bannerManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<BannerEntity>(BannerEntity, bannerId, { id: bannerId, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');
    /** 更新banner状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '首页-banner',
      operaModule: `更新首页banner状态 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 逻辑删除banner */
  async updateDelete(bannerId: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询banner是否存在 */
    const existing = await this.findOneById(bannerId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前banner不存在或已删除')
    /** 逻辑删除banner */
    const { affected } = await this.bannerManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<BannerEntity>(BannerEntity, bannerId, { id: bannerId, isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');
    /** 逻辑删除banner状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '首页-banner',
      operaModule: `删除首页banner -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }
  
}

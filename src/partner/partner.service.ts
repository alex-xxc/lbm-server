import { Injectable, Req, ExecutionContext } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { genSalt } from 'bcryptjs';

import { PartnerEntity } from './entities/partner.entity';

import { ResultData } from '../common/utils/result';
import { AppHttpCode } from '../common/enums/code.enum';

import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { FindPartnerListDto } from './dto/find-partner-list.dto';

import { OperalogService } from 'src/system/operalog/operalog.service';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(PartnerEntity)
    private readonly partnerRepo: Repository<PartnerEntity>,
    @InjectEntityManager()
    private readonly partnerManager: EntityManager,
    private readonly operalogService: OperalogService,
  ) {}

  async findOneById(id: string): Promise<PartnerEntity> {
    let partner = await this.partnerRepo.findOne({ where: { id } })
    partner = plainToInstance(PartnerEntity, { ...partner }, { enableImplicitConversion: true })
    return partner
  }

  /** 创建合作伙伴 */
  async create(createPartnerDto: CreatePartnerDto, account: String, ip: String) {
    // 防止重复创建
    const salt = await genSalt()
    const partner = plainToInstance(PartnerEntity, { salt, ...createPartnerDto }, { ignoreDecorators: true })
    const result = await this.partnerManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<PartnerEntity>(partner)
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');

    /** 创建合作伙伴成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '合作伙伴',
      operaModule: `添加合作伙伴 -【${createPartnerDto.partnerName}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询合作伙伴分页查询 */
  async findList(dto: FindPartnerListDto) {
    const { page, size, status, partnerName } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(partnerName ? { partnerName: Like(`%${partnerName}%`) } : null),
      isDelete: 1
    }
    const partner = await this.partnerRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(partner[0]), total: partner[1] })
  }

  /** 查询合作伙伴信息 */
  async findOne(id: string) {
    const partner = await this.findOneById(id)
    if (!partner) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该合作伙伴不存在或已删除')
    return ResultData.ok(instanceToPlain(partner))
  }

  /** 更新合作伙伴 */
  async update(updatePartnerDto: UpdatePartnerDto, account: String, ip: String) {
    /** 查询当前伙伴是否存在 */
    const existing = await this.findOneById(updatePartnerDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该合作伙伴不存在或已删除');
    /** 更新合作伙伴 */
    const partnerInfo = instanceToPlain(updatePartnerDto)
    const { affected } = await this.partnerManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<PartnerEntity>(PartnerEntity, updatePartnerDto.id, partnerInfo)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新合作伙伴成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '合作伙伴',
      operaModule: `更新合作伙伴 -【${updatePartnerDto.partnerName}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok();
  }

  /** 更新合作伙伴状态 */
  async updateStatus(partnerId: string, status: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询当前伙伴是否存在 */
    const existing = await this.findOneById(partnerId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前合作伙伴不存在或已删除')
    /** 更新合作伙伴状态 */
    const { affected } = await this.partnerManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<PartnerEntity>(PartnerEntity, partnerId, { id: partnerId, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');

    /** 更新合作伙伴状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '合作伙伴',
      operaModule: `更新合作伙伴状态 -【${existing.partnerName}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 逻辑删除合作伙伴 */
  async updateDelete(partnerId: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询当前伙伴是否存在 */
    const existing = await this.findOneById(partnerId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前合作伙伴不存在或已删除')
    /** 逻辑删除合作伙伴 */
    const { affected } = await this.partnerManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<PartnerEntity>(PartnerEntity, partnerId, { id: partnerId, isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');

    /** 逻辑删除合作伙伴成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '合作伙伴',
      operaModule: `删除合作伙伴 -【${existing.partnerName}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }
}

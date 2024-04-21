import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { genSalt, hash, compare, genSaltSync, hashSync } from 'bcryptjs';

import { MessageEntity } from './entities/message.entity';

import { ResultData } from '../common/utils/result';
import { AppHttpCode } from '../common/enums/code.enum';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FindMessageListDto } from './dto/find-message-list.dto';

import { OperalogService } from 'src/system/operalog/operalog.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    @InjectEntityManager()
    private readonly messageManager: EntityManager,
    private readonly operalogService: OperalogService,
  ) {}

  async findOneById(id: string): Promise<MessageEntity> {
    let message = await this.messageRepo.findOne({ where: { id } })
    message = plainToInstance(MessageEntity, { ...message }, { enableImplicitConversion: true })
    return message
  }

  /** 创建询盘 */
  async create(createMessageDto: CreateMessageDto) {
    const message = plainToInstance(MessageEntity, createMessageDto, { ignoreDecorators: true })
    const result = await this.messageManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<MessageEntity>(message)
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询询盘分页查询 */
  async findList(dto: FindMessageListDto) {
    const { page, size, status, phone } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(phone ? { phone: Like(`%${phone}%`) } : null),
      isDelete: 1
    }
    const message = await this.messageRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(message[0]), total: message[1] })
  }

  /** 查询单条询盘信息 */
  async findOne(id: string) {
    const message = await this.findOneById(id)
    if (!message) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该询盘不存在或已删除')
    return ResultData.ok(instanceToPlain(message))
  }

  /** 更新询盘阅读状态 */
  async updateStatus(messageId: string, status: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询询盘是否存在 */
    const existing = await this.findOneById(messageId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前询盘不存在或已删除')
    /** 更新询盘阅读状态 */
    const { affected } = await this.messageManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<MessageEntity>(MessageEntity, messageId, { id: messageId, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');

    /** 更新阅读状态后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '询盘',
      operaModule: `阅读询盘：【${existing.name}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 逻辑删除询盘 */
  async updateDelete(messageId: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询询盘是否存在 */
    const existing = await this.findOneById(messageId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前询盘不存在或已删除')
    /** 逻辑删除询盘 */
    const { affected } = await this.messageManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<MessageEntity>(MessageEntity, messageId, { id: messageId, isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');

    /** 逻辑删除成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '询盘',
      operaModule: `删除询盘 - 【${existing.name}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

}

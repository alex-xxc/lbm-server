import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Like, Repository, In, EntityManager } from 'typeorm'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { genSalt, hash, compare } from 'bcryptjs'

import { ResultData } from '../../common/utils/result'
import { getRedisKey } from '../../common/utils/utils'
import { RedisKeyPrefix } from '../../common/enums/redis-key-prefix.enum'
import { AppHttpCode } from '../../common/enums/code.enum'
import { RedisService } from '../../common/libs/redis/redis.service'

import { UserEntity } from './entities/clientuser.entity'

import { CreateClientUserDto } from './dto/create-clientuser.dto'
import { FindUserListDto } from './dto/find-clientuser-list.dto'
import { UpdateClientUserDto } from './dto/update-clientuser.dto'
import { SendMailClientuserDto } from './dto/send-mail-clientuser.dto';

import { OperalogService } from 'src/system/operalog/operalog.service';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class ClientUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectEntityManager()
    private readonly userManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly operalogService: OperalogService,
    private readonly emailService: EmailService,
  ) {}

  async findOneById(id: string): Promise<UserEntity> {
    let user = await this.userRepo.findOne({ where: { id } })
    user = plainToInstance(UserEntity, { ...user }, { enableImplicitConversion: true })
    return user
  }

  async findOneByAccount(account: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { account } })
  }

  /** 客户端用户注册 */
  async create(dto: CreateClientUserDto): Promise<ResultData> {
    if (dto.password !== dto.confirmPassword)
      return ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '两次输入密码不一致，请重试')
    // 防止重复创建 start
    if (await this.findOneByAccount(dto.account))
      return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '帐号已存在，请调整后重新注册！')
    if (await this.userRepo.findOne({ where: { phoneNum: dto.phoneNum } }))
      return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前手机号已存在，请调整后重新注册')
    if (await this.userRepo.findOne({ where: { email: dto.email } }))
      return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前邮箱已存在，请调整后重新注册')
    // 防止重复创建 end
    const salt = await genSalt()
    dto.password = await hash(dto.password, salt)
    // plainToInstance  忽略转换 @Exclude 装饰器
    const user = plainToInstance(UserEntity, { salt, ...dto }, { ignoreDecorators: true })
    const result = await this.userManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<UserEntity>(user)
    })

    return ResultData.ok(instanceToPlain(result))
  }

  /** 更新客户端用户信息 */
  async update(dto: UpdateClientUserDto, currUser: UserEntity, account: String, ip: String): Promise<ResultData> {
    const existing = await this.findOneById(dto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前用户不存在或已删除')
    if (existing.status === 0)
      return ResultData.fail(AppHttpCode.USER_ACCOUNT_FORBIDDEN, 'You have been disabled')
    
    const userInfo = instanceToPlain(dto)
    const { affected } = await this.userManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<UserEntity>(UserEntity, dto.id, userInfo)
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试')
    // 更新用户信息
    return ResultData.ok(instanceToPlain(affected))
  }

  /**
   * 启用 / 禁用 用户
   * @param userId
   * @param status
   * @returns
   */
  async updateStatus(userId: string, status: 0 | 1, currUserId: string, account: String, ip: String): Promise<ResultData> {
    // if (userId === currUserId) return ResultData.fail(AppHttpCode.USER_FORBIDDEN_UPDATE, '当前登录用户状态不可更改')
    const existing = await this.findOneById(userId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前用户不存在或已删除')

    const { affected } = await this.userManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<UserEntity>(UserEntity, userId, { id: userId, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试')
    await this.redisService.hmset(getRedisKey(RedisKeyPrefix.USER_INFO, userId), { status })
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '客户端用户管理',
      operaModule: `更改客户端用户状态 - ${status === 0 ? '禁用' : '启用'}【${existing.name}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 查询客户端用户列表 */
  async findList(dto: FindUserListDto): Promise<ResultData> {
    const { page, size, account, status, name, address } = dto

    const where = {
      ...(status ? { status } : null),
      ...(account ? { account: Like(`%${account}%`) } : null),
      ...(name ? { name: Like(`%${name}%`) } : null),
      ...(address ? { address: Like(`%${address}%`) } : null)
    }
    const users = await this.userRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(users[0]), total: users[1] })
  }

  /** 查询单个用户 */
  async findOne(id: string): Promise<ResultData> {
    const user = await this.findOneById(id)
    if (!user) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该用户不存在或已删除')
    return ResultData.ok(instanceToPlain(user))
  }

  async sendMail(dto: SendMailClientuserDto): Promise<ResultData> {
    /** 再发送邮箱 */
    const content = {
      email: dto.receiveEmail,
      content: `
        ${dto.emailMarketing}
        <br/>
        <br/>
        ${dto.content}
      `
    };
    const contentStr = JSON.stringify(content)
    const mailInfo = await this.emailService.sendEmail('AI营销系统', contentStr, dto.receiveEmail);

    if (!mailInfo) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '发送邮件失败')
    return ResultData.ok();
  }
  
}

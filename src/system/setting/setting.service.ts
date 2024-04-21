import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { AppHttpCode } from '../../common/enums/code.enum';

import { SettingEntity } from './entities/setting.entity'

import { ResultData } from '../../common/utils/result'

import { UpdateSettingDto } from './dto/update-setting.dto'
import { EmailDto } from './dto/create-email.dto'
import { SmsDto } from './dto/create-sms.dto'

import { OperalogService } from 'src/system/operalog/operalog.service'

import { EmailService } from 'src/common/email/email.service'
import { SmsService } from 'src/common/sms/sms.service'
import { LogisticsService } from 'src/common/logistics/logistics.service'

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepo: Repository<SettingEntity>,
    @InjectEntityManager()
    private readonly settingManager: EntityManager,
    private readonly operalogService: OperalogService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly logisticsService: LogisticsService,
  ) {}

  async findOneInfo() {
    let id = '1'
    let settingInfo = await this.settingRepo.findOne({ where: { id } });

    settingInfo = plainToInstance(SettingEntity, { ...settingInfo }, { enableImplicitConversion: true })
    return settingInfo
  }

  /** 测试发送邮箱 */
  async sendMail(emailDto: EmailDto) {
    const mailInfo = await this.emailService.sendEmail('', JSON.stringify(emailDto), '252300493@qq.com');

    if (!mailInfo) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '发送邮件失败')
    return ResultData.ok();
  }

  /** 测试发送短信 */
  async sendSms(smsDto: SmsDto) {
    const smsInfo = await this.smsService.sendSms(smsDto);

    if (!smsInfo) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '发送短信失败')
    return ResultData.ok();
  }

  /** 测试查询物流 */
  async sendLogistics() {
    const info = await this.logisticsService.sendLogistics('STO', '999999999999');

    if (!info) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '查询物流信息失败，请查看对应的配置信息是否填写')
    return ResultData.ok(info);
  }

  /** 查询系统设置 */
  async findOne() {
    const settingInfo = await this.findOneInfo();
    return ResultData.ok(instanceToPlain(settingInfo))
  }

  /** 更新系统设置 */
  async update(updateInfoDto: UpdateSettingDto, account: String, ip: String) {
    const infoData = await this.findOneInfo();

    if (!infoData) {
      // 没有则往系统设置表里插入数据
      const settingInfo = plainToInstance(SettingEntity, updateInfoDto, { ignoreDecorators: true })
      const result = await this.settingManager.transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<SettingEntity>(settingInfo)
      })
      return ResultData.ok(instanceToPlain(result));
    } else {
      // 有则更新系统设置表
      const settingInfo = plainToInstance(SettingEntity, updateInfoDto, { ignoreDecorators: true })
      settingInfo.id = '1';
      const result = await this.settingManager.transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<SettingEntity>(settingInfo);
      })

      if (ip.indexOf('::ffff:') !== -1) {
        ip = ip.substring(7)
      }
      this.operalogService.create({
        systemMenu: '系统设置',
        operaModule: `更新系统设置`,
        operaName: account,
        operaIp: ip,
        status: 1
      })
      return ResultData.ok(instanceToPlain(result));
    }
  }

}

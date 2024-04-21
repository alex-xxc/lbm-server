import { Controller, Get, Body, Req, Post, Put, Ip } from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { SettingEntity } from './entities/setting.entity';

import { UpdateSettingDto } from './dto/update-setting.dto'
import { EmailDto } from './dto/create-email.dto'
import { SmsDto } from './dto/create-sms.dto'

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'

@ApiTags('系统设置模块')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiOperation({ summary: '查询系统设置' })
  @ApiResult(SettingEntity)
  async findOne(): Promise<ResultData> {
    return this.settingService.findOne();
  }

  @Put()
  @ApiOperation({ summary: '更新系统设置' })
  @ApiResult()
  async update(@Body() updateSettingDto: UpdateSettingDto, @Req() req, @Ip() ip) {
    return await this.settingService.update(updateSettingDto, req.user.account, ip);
  }

  @Post('/sendMail')
  @ApiOperation({ summary: '测试发送邮箱' })
  @ApiResult()
  async sendMail(@Body() emailDto: EmailDto) {
    return await this.settingService.sendMail(emailDto);
  }

  @Post('/sendSms')
  @ApiOperation({ summary: '测试发送短信' })
  @ApiResult()
  async sendSms(@Body() smsDto: SmsDto) {
    return await this.settingService.sendSms(smsDto);
  }

  @Get('/sendLogistics')
  @ApiOperation({ summary: '测试查询物流' })
  @ApiResult()
  async sendLogistics() {
    return await this.settingService.sendLogistics();
  }
}

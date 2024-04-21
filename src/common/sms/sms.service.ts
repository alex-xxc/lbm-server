import { Injectable } from '@nestjs/common';
import SMSClient from '@alicloud/sms-sdk';

import { GetSettingService } from 'src/system/setting/get.setting.service';

@Injectable()
export class SmsService {
  constructor(
    private readonly getSettingService: GetSettingService
  ) {}
  
  // 获取系统设置
  async getSettingInfo() {
    let settingInfo = await this.getSettingService.findOneInfo()
    return settingInfo
  }

  // 发送短信
  async sendSms(phone) {
    const { smsAccessKey, smsAccessSecret, smsSignName, smsCode } = await this.getSettingInfo();
    if (!smsAccessKey) return false; // 没填写短信key
    if (!smsAccessSecret) return false; // 没填写短信密钥
    if (!smsSignName) return false; // 没填写短信签名
    if (!smsCode) return false; // 没填写短信模板code

    // 初始化sms_client
    const smsClient = new SMSClient({accessKeyId: smsAccessKey, secretAccessKey: smsAccessSecret})
    
    // 开始发送短信
    const info = await smsClient.sendSMS({
      PhoneNumbers: phone.phone,
      SignName: smsSignName, //签名名称
      TemplateCode: smsCode, //模版CODE 
      TemplateParam: '{"code":"POPO","name":"ChuiChui"}', // 短信模板变量
    }).then(result => {
      console.log("发送短信成功", result)
      const { Code } = result;
      if (Code == 'OK') {
        return result
      }
    }).catch(err => {
      console.log("发送短信报错：", err);
      return false
    })

    if (info) return true;
    return false;
  }
}

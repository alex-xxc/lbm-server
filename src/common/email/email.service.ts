import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { GetSettingService } from 'src/system/setting/get.setting.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly getSettingService: GetSettingService
  ) {}

  async getSettingInfo() {
    let settingInfo = await this.getSettingService.findOneInfo();
    return settingInfo
  }

  // 发送邮箱
  async sendEmail(title: string, content: string, receiveEmail: string) {
    const contentObj = JSON.parse(content)
    const settingInfo = await this.getSettingInfo()
    if (!settingInfo.emailPort) return false; // 邮箱没填写端口
    if (!settingInfo.emailMail) return false; // 邮箱没填写发送邮箱
    if (!settingInfo.emailCode) return false; // 邮箱没填写授权码
    const transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: settingInfo.emailPort,
      secure: false,
      auth: {
          user: settingInfo.emailMail,
          pass: settingInfo.emailCode
      },
    });

    const formTitle = `${title} - ${settingInfo.emailMail}`
    const info = await transporter.sendMail({
      from: formTitle,
      // to: settingInfo.receiveMail,
      to: receiveEmail,
      subject: title, 
      html: contentObj.content
    });
    
    if (info.messageId) return true;
    return false;
  }
}

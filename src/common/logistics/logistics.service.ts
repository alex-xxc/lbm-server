import { Injectable } from '@nestjs/common'
import querystring from 'querystring'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import md5Hex from 'md5-hex'
import { GetSettingService } from 'src/system/setting/get.setting.service'

@Injectable()
export class LogisticsService {
  constructor(
    private readonly getSettingService: GetSettingService,
    private readonly http: HttpService,
  ) {}
  
  // 获取系统设置
  async getSettingInfo() {
    let settingInfo = await this.getSettingService.findOneInfo()
    return settingInfo
  }

  // 查询物流
  async sendLogistics(ShipperCode: string, LogisticCode: string) {
    const { logisticsUserId, logisticsKey } = await this.getSettingInfo();
    if (!logisticsUserId) return false; // 没填写用户id
    if (!logisticsKey) return false; // 没填写api的key
    const Url = 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx';

    //请求接口指令
    const RequestType  = '1002';
    // 组装应用级参数
    const RequestData = {
      'CustomerName': '',
      'OrderCode': '',
      'ShipperCode': ShipperCode, // 快递公司的编码
      'LogisticCode': LogisticCode, // 快递单号
    };
    const DataSign = Buffer.from(md5Hex(JSON.stringify(RequestData)+logisticsKey)).toString('base64')
    const reqParams = {
      RequestType,
      EBusinessID: logisticsUserId,
      DataSign,
      RequestData: JSON.stringify(RequestData),
      DataType: 2
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const { data } = await lastValueFrom(this.http.post(Url, querystring.stringify(reqParams), { headers }))
    return data;
  }
}

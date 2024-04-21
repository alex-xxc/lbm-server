import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import CryptoJS from 'crypto-js';
import WebSocket from 'ws';
import { ResultData } from '../utils/result';

@Injectable()
export class WsAiService {
  private ws = null;
  private socketStatus = false;
  private ttsWS = null;
  private resText = '';
  private connectionState = false;
  private APPID = '';
  private API_SECRET = '';
  private API_KEY = '';
  constructor(
  ) {
  }

  async startAi(): Promise<ResultData> {
    await this.createAiUrl('黄河多长');
    return ResultData.ok({ msgText: '' });
    
  }

  createAiUrl(text) {
    return this.getAiWebsocketUrl().then(url => {
      this.resText = '';
      const websocketUrl = url;
      const ttsWs = new WebSocket(websocketUrl);
      this.ttsWS = ttsWs;

      ttsWs.onopen = e => {
        this.webSocketSend(text)
      }

      ttsWs.onmessage = e => {
        this.result(e.data)
      }

      ttsWs.onerror = e => {
        console.error(`详情查看：${e}`)
      }

      ttsWs.onclose = e => {
        console.log(this.resText)
      }
    })
  }

  // websocket发送数据
  webSocketSend(text) {
    let params = {
        "header": {
            "app_id": this.APPID,
        },
        "parameter": {
            "chat": {
                "domain": "generalv3",
                "temperature": 0.5,
                "max_tokens": 2048
            }
        },
        "payload": {
            "message": {
                "text": [
                    {
                        "role": "user",
                        "content": `${text}`
                    }
                ]
            }
        }
    }
    this.ttsWS.send(JSON.stringify(params))
  }

  // websocket接收数据的处理
  result(resultData) {
    console.log('resultData', resultData)
    let total_res = "";
    let jsonData = JSON.parse(resultData)
    total_res = total_res + resultData;
    this.resText = this.resText + jsonData.payload.choices.text[0].content;
    // console.log(jsonData)
    // 提问失败
    if (jsonData.header.code !== 0) {
      // alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`)
      console.error(`提问失败:${jsonData.header.code}:${jsonData.header.message}`)
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      this.ttsWS.close();
      this.connectionState = true;
    }
  }

  getAiWebsocketUrl() {
    return new Promise((resolve, reject) => {
      const date = new Date().toUTCString().replace("GMT", "+0000");
      let header = "host: spark-api.xf-yun.com\n"
      header += "date: " + date + "\n"
      header += `GET /v3.1/chat HTTP/1.1`
      const hmacSHA = CryptoJS.HmacSHA256(header, this.API_SECRET);
      const base64 = CryptoJS.enc.Base64.stringify(hmacSHA)
      const authorization_origin = `api_key="${this.API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${base64}"`
      const authorization = btoa(authorization_origin);
      const url = `wss://spark-api.xf-yun.com/v3.1/chat?authorization=${authorization}&date=${encodeURIComponent(date)}&host=spark-api.xf-yun.com`
      resolve(url)
    })
  }

}

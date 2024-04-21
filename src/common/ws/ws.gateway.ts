import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import WebSocket from 'ws';
import CryptoJS from 'crypto-js';

@WebSocketGateway(3002)
export class WsStartGateway {
  private ttsWS = null;
  private connectionState = false
  private resText = '';
  private APPID = '';
  private API_SECRET = '';
  private API_KEY = '';
  private websocketUrl = '';

  /** 普通的AI方法 */
  @SubscribeMessage('aiEvent')
  aiEvent(@MessageBody() data: any, @ConnectedSocket() client: WebSocket): any {
    console.log('收到消息 client:', data, 'aiEvent');
    this.resText = '';
    const wsUrl = this.getAiWebsocketUrl();
    const ttsWs = new WebSocket(this.websocketUrl);
    this.ttsWS = ttsWs;
    if (data === '') {
      client.send(JSON.stringify({ event: 'tmp', data: '请输入文本', code: 500}));
      return false
    }
    ttsWs.onopen = e => {
      this.webSocketSend(data)
    }

    ttsWs.onmessage = e => {
      let jsonData = JSON.parse(e.data);
      this.result(e.data)
    }

    ttsWs.onerror = e => {
      console.error(`详情查看：${e}`)
    }

    ttsWs.onclose = e => {
      client.send(JSON.stringify({ event: 'tmp', data: this.resText }));
    }

  }

  /** AI生成标签方法 */
  @SubscribeMessage('aiTagsEvent')
  aiTagsEvent(@MessageBody() data: any, @ConnectedSocket() client: WebSocket): any {
    console.log('收到消息 client:', data, 'aiTagsEvent');
    this.resText = '';
    const wsUrl = this.getAiWebsocketUrl();
    const ttsWs = new WebSocket(this.websocketUrl);
    this.ttsWS = ttsWs;
    if (data === '') {
      client.send(JSON.stringify({ event: 'tmp', data: '请输入文本', code: 500}));
      return false
    }
    ttsWs.onopen = e => {
      this.webSocketSend(data)
    }

    ttsWs.onmessage = e => {
      let jsonData = JSON.parse(e.data);
      // console.log(jsonData)
      this.resultTags(e.data)
    }

    ttsWs.onerror = e => {
      console.error(`详情查看：${e}`)
    }

    ttsWs.onclose = e => {
      client.send(JSON.stringify({ event: 'tmp', data: this.resText }));
    }
  }

  // websocket接收数据的处理
  result(resultData) {
    let jsonData = JSON.parse(resultData)
    this.resText = this.resText + jsonData.payload.choices.text[0].content;
    // 提问失败
    if (jsonData.header.code !== 0) {
      console.error(`提问失败:${jsonData.header.code}:${jsonData.header.message}`)
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      this.ttsWS.close();
      this.connectionState = true;
    }
  }

  // websocket接收数据的处理
  resultTags(resultData) {
    let jsonData = JSON.parse(resultData);

    this.resText = this.resText + jsonData.payload.choices.text[0].content;
    // 生成失败
    if (jsonData.header.code !== 0) {
      console.error(`生成失败:${jsonData.header.code}:${jsonData.header.message}`)
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      this.ttsWS.close();
      this.connectionState = true;
    }
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

  /** 生成星火大模型的API */
  getAiWebsocketUrl() {
    const date = new Date().toUTCString().replace("GMT", "+0000");
    let header = "host: spark-api.xf-yun.com\n"
    header += "date: " + date + "\n"
    header += `GET /v3.1/chat HTTP/1.1`
    const hmacSHA = CryptoJS.HmacSHA256(header, this.API_SECRET);
    const base64 = CryptoJS.enc.Base64.stringify(hmacSHA)
    const authorization_origin = `api_key="${this.API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${base64}"`
    const authorization = btoa(authorization_origin);
    const url = `wss://spark-api.xf-yun.com/v3.1/chat?authorization=${authorization}&date=${encodeURIComponent(date)}&host=spark-api.xf-yun.com`
    this.websocketUrl = url;
    return url;
  }
}
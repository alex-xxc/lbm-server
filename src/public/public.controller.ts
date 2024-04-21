import { Controller, Get, Body, Post, Req, Param, Put, Ip, Sse } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { ResultData } from '../common/utils/result'
import { ApiResult } from '../common/decorators/api-result.decorator'

import { PublicService } from './public.service';
import { WsAiService } from '../common/ws/ws.service';

import { UserEntity } from '../client/clientuser/entities/clientuser.entity'

import { Observable, interval, map } from 'rxjs';
import { sseEvent } from 'src/common/sseEvent/utils';

export interface MessageEvent {
  data: object;
}

@ApiTags('公共接口')
@ApiBearerAuth()
@Controller('public')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
  ) {}

  /** 查询客户端用户列表所有 */
  @Get('clientUserList')
  @ApiOperation({ summary: '查询客户端用户列表所有' })
  @ApiResult(UserEntity, true, true)
  async findClientUserList() {
    return this.publicService.findClientUserList();
  }

  /** Sse 查询用户提醒数量，可自定义为全局 */
  @Sse('getMessageNum')
  async sse(): Promise<Observable<MessageEvent>> {
    return new Observable<any>((observer) => {
      sseEvent.getEvent().on('send', (data: any) => {
        observer.next({ data: data });
      });
    });
  }

  /** 查询未读留言列表 */
  @Get('messageNumber')
  @ApiOperation({ summary: '查询未读留言列表' })
  @ApiResult()
  async findMessageNumber(): Promise<ResultData> {    
    return await this.publicService.findMessageList();
  }

  /** 获取过去12个月的访问数据 */
  @Get('getAccess')
  @ApiOperation({ summary: '获取过去12个月的访问数据' })
  @ApiResult()
  async getFormerlyMonth(@Ip() ip): Promise<ResultData> {
    return await this.publicService.getFormerlyMonth()
  }

  /** 获取内容访问量、收藏量、咨询量 */
  @Get('access/statis')
  @ApiOperation({ summary: '更新页面访问量' })
  @ApiResult()
  async getContentAccess(): Promise<ResultData> {
    return await this.publicService.getContentAccess();
  }
}

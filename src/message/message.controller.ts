import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { MessageEntity } from './entities/message.entity';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateDeleteDto } from './dto/update-delete.dto';
import { FindMessageListDto } from './dto/find-message-list.dto';

import { ResultData } from '../common/utils/result'
import { ApiResult } from '../common/decorators/api-result.decorator'

@ApiTags('询盘模块')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('list')
  @ApiOperation({ summary: '查询询盘列表' })
  @ApiResult(MessageEntity, true, true)
  async findList(@Query() dto: FindMessageListDto): Promise<ResultData> {
    return await this.messageService.findList(dto)
  }

  @Post()
  @ApiOperation({ summary: '创建询盘' })
  @ApiResult()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.create(createMessageDto);
  }

  @Get('info')
  @ApiOperation({ summary: '根据id查询询盘信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(MessageEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.messageService.findOne(id);
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改询盘阅读状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.messageService.updateStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('/delete')
  @ApiOperation({ summary: '逻辑删除询盘' })
  @ApiResult()
  async delete(@Body() dto: UpdateDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.messageService.updateDelete(dto.id, dto.isDelete, req.user.account, ip)
  }
}

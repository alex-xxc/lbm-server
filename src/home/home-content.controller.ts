import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { HomeContentService } from './home-content.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { HomeContentEntity } from './entities/home-content.entity';

import { CreateHomeContentDto } from './home-content-dto/create.dto';
import { UpdateHomeContentDto } from './home-content-dto/update.dto';
import { UpdateStatusDto } from './home-content-dto/update-status.dto';
import { UpdateDeleteDto } from './home-content-dto/update-delete.dto';
import { FindHomeContentListDto } from './home-content-dto/find-list.dto';

import { ResultData } from '../common/utils/result'
import { ApiResult } from '../common/decorators/api-result.decorator'

@ApiTags('自定义AI内容模块')
@ApiBearerAuth()
@Controller('homeContent')
export class HomeContentController {
  constructor(private readonly homeContentService: HomeContentService) {}

  @Get('list')
  @ApiOperation({ summary: '查询自定义AI内容列表' })
  @ApiResult(HomeContentEntity, true, true)
  async findList(@Query() dto: FindHomeContentListDto): Promise<ResultData> {
    return await this.homeContentService.findList(dto)
  }

  @Post()
  @ApiOperation({ summary: '创建自定义AI内容' })
  @ApiResult()
  async create(@Body() createDictDto: CreateHomeContentDto, @Req() req, @Ip() ip) {
    return await this.homeContentService.create(createDictDto, req.user.account, ip);
  }

  @Get('info')
  @ApiOperation({ summary: '根据id查询自定义AI内容' })
  @ApiQuery({ name: 'id' })
  @ApiResult(HomeContentEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.homeContentService.findOne(id);
  }

  @Get('info/:code')
  @ApiOperation({ summary: '根据类型查询自定义AI内容' })
  @ApiResult(HomeContentEntity)
  async findOneInfo(@Param('code') code: string): Promise<ResultData> {
    return this.homeContentService.findOneInfo(code);
  }

  @Put()
  @ApiOperation({ summary: '更新自定义AI内容' })
  @ApiResult()
  async update(@Body() updateDictDto: UpdateHomeContentDto, @Req() req, @Ip() ip) {
    return await this.homeContentService.update(updateDictDto, req.user.account, ip);
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改自定义AI内容状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.homeContentService.updateStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('/delete')
  @ApiOperation({ summary: '逻辑删除自定义AI内容' })
  @ApiResult()
  async delete(@Body() dto: UpdateDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.homeContentService.updateDelete(dto.id, dto.isDelete, req.user.account, ip)
  }
  
}

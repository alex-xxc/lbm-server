import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { HomeContentListService } from './home-content-list.service';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { HomeContentListEntity } from './entities/home-content-list.entity';

import { CreateHomeConentListDto } from './home-content-list-dto/create.dto';
import { UpdateListDto } from './home-content-list-dto/update.dto';
import { UpdateListStatusDto } from './home-content-list-dto/update-status.dto';
import { UpdateListDeleteDto } from './home-content-list-dto/update-delete.dto';
import { FindListDto } from './home-content-list-dto/find-list.dto';

import { ResultData } from '../common/utils/result'
import { ApiResult } from '../common/decorators/api-result.decorator'

@ApiTags('自定义AI内容关联列表模块')
@ApiBearerAuth()
@Controller('homeContent')
export class HomeContentListController {
  constructor(private readonly homeContentListService: HomeContentListService) {}

  @Get('list/contentList')
  @ApiOperation({ summary: '查询自定义AI内容关联列表-列表' })
  @ApiResult(HomeContentListEntity, true, true)
  async findList(@Query() dto: FindListDto): Promise<ResultData> {
    return await this.homeContentListService.findList(dto)
  }

  @Post('contentList')
  @ApiOperation({ summary: '创建自定义AI内容关联列表-信息' })
  @ApiResult()
  async create(@Body() createHomeConentListDto: CreateHomeConentListDto, @Req() req, @Ip() ip) {
    return await this.homeContentListService.create(createHomeConentListDto, req.user.account, ip);
  }

  @Get('contentList/info')
  @ApiOperation({ summary: '根据id查询自定义AI内容关联列表-信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(HomeContentListEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.homeContentListService.findOne(id);
  }

  @Put('contentList')
  @ApiOperation({ summary: '更新自定义AI内容关联列表-信息' })
  @ApiResult()
  async update(@Body() updateListDto: UpdateListDto, @Req() req, @Ip() ip) {
    return await this.homeContentListService.update(updateListDto, req.user.account, ip);
  }

  @Put('contentList/status/change')
  @ApiOperation({ summary: '更改自定义AI内容关联列表-状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateListStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.homeContentListService.updateStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('contentList/delete')
  @ApiOperation({ summary: '逻辑删除自定义AI内容关联列表-单条数据' })
  @ApiResult()
  async delete(@Body() dto: UpdateListDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.homeContentListService.updateDelete(dto.id, dto.isDelete, req.user.account, ip)
  }
}

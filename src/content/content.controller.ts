import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'

import { ResultData } from '../common/utils/result'
import { ApiResult } from '../common/decorators/api-result.decorator'

import { ContentEntity } from './entities/content.entity';
import { ColumnEntity } from './entities/column.entity';
import { TagsEntity } from './entities/tags.entity';

import { ContentService } from './content.service';
import { FindContentListDto } from './dto/find-content-list.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { UpdateContentStatusDto } from './dto/update-content-status.dto';
import { UpdateContentDeleteDto } from './dto/update-content-delete.dto';

import { FindTagsListDto } from './dto/find-tags-list.dto';
import { CreateTagsDto } from './dto/create-content-tags.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';
import { UpdateTagsStatusDto } from './dto/update-tags-status.dto';
import { UpdateTagsDeleteDto } from './dto/update-tags-delete.dto';

import { FindColumnListDto } from './dto/find-column-list.dto';
import { CreateColumnDto } from './dto/create-content-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { UpdateColumnDeleteDto } from './dto/update-column-delete.dto';

@ApiTags('内容模块')
@ApiBearerAuth()
@Controller('content')

export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  /** 
   * 内容区start
   */
  @Get('list')
  @ApiOperation({ summary: '查询内容列表' })
  @ApiResult(ContentEntity, true, true)
  async findContentList(@Query() dto: FindContentListDto): Promise<ResultData> {
    return await this.contentService.findContentList(dto)
  }

  @Post()
  @ApiOperation({ summary: '创建内容信息' })
  @ApiResult()
  async create(@Body() createContentDto: CreateContentDto, @Req() req, @Ip() ip) {
    return await this.contentService.createContent(createContentDto, req.user.account, ip);
  }

  @Get('info')
  @ApiOperation({ summary: '根据id查询内容信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(ContentEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.contentService.findContentOne(id);
  }

  @Put()
  @ApiOperation({ summary: '更新内容信息' })
  @ApiResult()
  async update(@Body() updateContentDto: UpdateContentDto, @Req() req, @Ip() ip) {
    return await this.contentService.updateContent(updateContentDto, req.user.account, ip);
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改内容状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateContentStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.contentService.updateContentStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('/delete')
  @ApiOperation({ summary: '逻辑删除内容' })
  @ApiResult()
  async delete(@Body() dto: UpdateContentDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.contentService.updateContentDelete(dto.id, dto.isDelete, req.user.account, ip)
  }

  /** 
   * 内容区end -----------------------------
   */


  /** 
   * 栏目区start
   */

  @Get('column/list')
  @ApiOperation({ summary: '分页查询栏目' })
  @ApiResult(ColumnEntity, true, true)
  async findColumnList(@Query() dto: FindColumnListDto): Promise<ResultData> {
    return await this.contentService.findColumnList(dto)
  }

  @Get('column/AllList')
  @ApiOperation({ summary: '查询栏目列表' })
  @ApiResult(ColumnEntity, true, true)
  async findColumnAllList(): Promise<ResultData> {
    return await this.contentService.findColumnAllList()
  }

  @Post('column')
  @ApiOperation({ summary: '创建栏目信息' })
  @ApiResult()
  async createColumn(@Body() createColumnDto: CreateColumnDto, @Req() req, @Ip() ip) {
    return await this.contentService.createColumn(createColumnDto, req.user.account, ip);
  }

  @Get('column/info')
  @ApiOperation({ summary: '根据id查询栏目信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(ColumnEntity)
  async findColumnOne(@Query('id') id: string): Promise<ResultData> {
    return this.contentService.findColumnOne(id);
  }

  @Put('column')
  @ApiOperation({ summary: '更新栏目信息' })
  @ApiResult()
  async updateColumn(@Body() updateColumnDto: UpdateColumnDto, @Req() req, @Ip() ip) {
    return await this.contentService.updateColumn(updateColumnDto, req.user.account, ip);
  }

  @Delete('column/delete')
  @ApiOperation({ summary: '逻辑删除栏目' })
  @ApiResult()
  async deleteColumn(@Body() dto: UpdateColumnDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.contentService.updateColumnDelete(dto.id, dto.isDelete, req.user.account, ip)
  }

  /** 
   * 栏目区end -----------------------------
   */

  /** 
   * 标签区start
   */
  @Get('tags/list')
  @ApiOperation({ summary: '查询标签分页' })
  @ApiResult(TagsEntity, true, true)
  async findTagsList(@Query() dto: FindTagsListDto): Promise<ResultData> {
    return await this.contentService.findTagsList(dto)
  }

  @Get('tags/AllList')
  @ApiOperation({ summary: '查询标签列表' })
  @ApiResult(TagsEntity, true, true)
  async findTagsAllList(): Promise<ResultData> {
    return await this.contentService.findTagsAllList()
  }

  @Post('tags')
  @ApiOperation({ summary: '创建标签信息' })
  @ApiResult()
  async createTags(@Body() createTagsDto: CreateTagsDto, @Req() req, @Ip() ip) {
    return await this.contentService.createTags(createTagsDto, req.user.account, ip);
  }

  @Post('aiTags')
  @ApiOperation({ summary: '创建AI标签信息' })
  @ApiResult()
  async createAiTags(@Body() data, @Req() req, @Ip() ip) {
    return await this.contentService.createAiTags(data, req.user.account, ip);
  }

  @Get('tags/info')
  @ApiOperation({ summary: '根据id查询标签信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(TagsEntity)
  async findTagsOne(@Query('id') id: string): Promise<ResultData> {
    return this.contentService.findTagsOne(id);
  }

  @Put('tags')
  @ApiOperation({ summary: '更新标签' })
  @ApiResult()
  async updateTags(@Body() updateTagsDto: UpdateTagsDto, @Req() req, @Ip() ip) {
    return await this.contentService.updateTags(updateTagsDto, req.user.account, ip);
  }

  @Put('tags/status/change')
  @ApiOperation({ summary: '更改标签状态' })
  @ApiResult()
  async updateTagsStatus(@Body() dto: UpdateTagsStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.contentService.updateTagsStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('tags/delete')
  @ApiOperation({ summary: '逻辑删除标签' })
  @ApiResult()
  async deleteTags(@Body() dto: UpdateTagsDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.contentService.updateTagsDelete(dto.id, dto.isDelete, req.user.account, ip)
  }

  /** 
   * 标签区end -----------------------------
   */
}

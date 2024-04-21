import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'

import { BannerService } from './banner.service';
import { BannerEntity } from './entities/banner.entity';

import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateBannerStatusDto } from './dto/update-banner-status.dto';
import { UpdateBannerDeleteDto } from './dto/update-banner-delete.dto';
import { FindBannerListDto } from './dto/find-banner-list.dto';

import { ResultData } from '../common/utils/result'
import { ApiResult } from '../common/decorators/api-result.decorator'

@ApiTags('首页banner模块')
@ApiBearerAuth()
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('list')
  @ApiOperation({ summary: '查询首页banner列表' })
  @ApiResult(BannerEntity, true, true)
  async findList(@Query() dto: FindBannerListDto): Promise<ResultData> {
    return await this.bannerService.findList(dto)
  }

  @Get('list/web')
  @ApiOperation({ summary: '查询首页banner列表' })
  @ApiResult(BannerEntity, true, true)
  async findAllList(): Promise<ResultData> {
    return await this.bannerService.findAllList()
  }

  @Post()
  @ApiOperation({ summary: '创建首页banner信息' })
  @ApiResult()
  async create(@Body() createBannerDto: CreateBannerDto, @Req() req, @Ip() ip) {
    return await this.bannerService.create(createBannerDto, req.user.account, ip);
  }

  @Get('info')
  @ApiOperation({ summary: '根据id查询首页banner信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(BannerEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.bannerService.findOne(id);
  }

  @Put()
  @ApiOperation({ summary: '更新首页banner信息' })
  @ApiResult()
  async update(@Body() updateBannerDto: UpdateBannerDto, @Req() req, @Ip() ip) {
    return await this.bannerService.update(updateBannerDto, req.user.account, ip);
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改首页banner状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateBannerStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.bannerService.updateStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('/delete')
  @ApiOperation({ summary: '逻辑删除首页banner' })
  @ApiResult()
  async delete(@Body() dto: UpdateBannerDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.bannerService.updateDelete(dto.id, dto.isDelete, req.user.account, ip)
  }

}

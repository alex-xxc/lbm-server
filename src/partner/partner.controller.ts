import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { PartnerEntity } from './entities/partner.entity';

import { CreatePartnerDto } from './dto/create-partner.dto'
import { UpdatePartnerDto } from './dto/update-partner.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { UpdateDeleteDto } from './dto/update-delete.dto'
import { FindPartnerListDto } from './dto/find-partner-list.dto'

import { ResultData } from '../common/utils/result'
import { ApiResult } from '../common/decorators/api-result.decorator'

@ApiTags('合作伙伴模块')
@ApiBearerAuth()
@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get('list')
  @ApiOperation({ summary: '查询合作伙伴列表' })
  @ApiResult(PartnerEntity, true, true)
  async findList(@Query() dto: FindPartnerListDto): Promise<ResultData> {
    return await this.partnerService.findList(dto)
  }

  @Post()
  @ApiOperation({ summary: '创建合作伙伴信息' })
  @ApiResult()
  async create(@Body() createPartnerDto: CreatePartnerDto, @Req() req, @Ip() ip) {
    return await this.partnerService.create(createPartnerDto, req.user.account, ip);
  }

  @Get('info')
  @ApiOperation({ summary: '根据id查询合作伙伴信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(PartnerEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.partnerService.findOne(id);
  }

  @Put()
  @ApiOperation({ summary: '更新合作伙伴信息' })
  @ApiResult()
  async update(@Body() updatePartnerDto: UpdatePartnerDto, @Req() req, @Ip() ip) {
    return await this.partnerService.update(updatePartnerDto, req.user.account, ip);
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改合作伙伴状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.partnerService.updateStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('/delete')
  @ApiOperation({ summary: '逻辑删除合作伙伴' })
  @ApiResult()
  async delete(@Body() dto: UpdateDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.partnerService.updateDelete(dto.id, dto.isDelete, req.user.account, ip)
  }

}

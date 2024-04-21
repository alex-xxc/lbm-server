import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { DictDataService } from './dict-data.service';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { DictEntity } from './entities/dict.entity';

import { CreateDictDataDto } from './data-dto/create-dict.dto'
import { UpdateDictDataDto } from './data-dto/update-dict.dto'
import { UpdateDataStatusDto } from './data-dto/update-status.dto'
import { UpdateDataDeleteDto } from './data-dto/update-delete.dto'
import { FindDictDataListDto } from './data-dto/find-dict-list.dto'

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'

@ApiTags('字典数据模块')
@ApiBearerAuth()
@Controller('dict')
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  @Get('list/data')
  @ApiOperation({ summary: '查询字典数据列表' })
  @ApiResult(DictEntity, true, true)
  async findList(@Query() dto: FindDictDataListDto): Promise<ResultData> {
    return await this.dictDataService.findList(dto)
  }

  @Post('/data')
  @ApiOperation({ summary: '创建字典数据信息' })
  @ApiResult()
  async create(@Body() createDictDataDto: CreateDictDataDto, @Req() req, @Ip() ip) {
    return await this.dictDataService.create(createDictDataDto, req.user.account, ip);
  }

  @Get('data/info')
  @ApiOperation({ summary: '根据id查询字典信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(DictEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.dictDataService.findOne(id);
  }

  @Put('/data')
  @ApiOperation({ summary: '更新字典数据信息' })
  @ApiResult()
  async update(@Body() updateDictDto: UpdateDictDataDto, @Req() req, @Ip() ip) {
    return await this.dictDataService.update(updateDictDto, req.user.account, ip);
  }

  @Put('/data/status/change')
  @ApiOperation({ summary: '更改字典数据状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateDataStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.dictDataService.updateStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('/data/delete')
  @ApiOperation({ summary: '逻辑删除字典数据' })
  @ApiResult()
  async delete(@Body() dto: UpdateDataDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.dictDataService.updateDelete(dto.id, dto.isDelete, req.user.account, ip)
  }
}

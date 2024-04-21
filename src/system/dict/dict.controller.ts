import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { DictService } from './dict.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { DictEntity } from './entities/dict.entity';

import { CreateDictDto } from './dto/create-dict.dto'
import { UpdateDictDto } from './dto/update-dict.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { UpdateDeleteDto } from './dto/update-delete.dto'
import { FindDictListDto } from './dto/find-dict-list.dto'

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'

@ApiTags('字典模块')
@ApiBearerAuth()
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Get('list')
  @ApiOperation({ summary: '查询字典列表' })
  @ApiResult(DictEntity, true, true)
  async findList(@Query() dto: FindDictListDto): Promise<ResultData> {
    return await this.dictService.findList(dto)
  }

  @Post()
  @ApiOperation({ summary: '创建字典信息' })
  @ApiResult()
  async create(@Body() createDictDto: CreateDictDto, @Req() req, @Ip() ip) {
    return await this.dictService.create(createDictDto, req.user.account, ip);
  }

  @Get('info')
  @ApiOperation({ summary: '根据id查询字典信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(DictEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.dictService.findOne(id);
  }

  @Get('info/:dictType')
  @ApiOperation({ summary: '根据类型查询字典信息' })
  @ApiResult(DictEntity)
  async findOneInfo(@Param('dictType') dictType: string): Promise<ResultData> {
    return this.dictService.findOneInfo(dictType);
  }

  @Put()
  @ApiOperation({ summary: '更新字典信息' })
  @ApiResult()
  async update(@Body() updateDictDto: UpdateDictDto, @Req() req, @Ip() ip) {
    return await this.dictService.update(updateDictDto, req.user.account, ip);
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改字典状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.dictService.updateStatus(dto.id, dto.status, req.user.account, ip)
  }

  @Delete('/delete')
  @ApiOperation({ summary: '逻辑删除字典' })
  @ApiResult()
  async delete(@Body() dto: UpdateDeleteDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.dictService.updateDelete(dto.id, dto.isDelete, req.user.account, ip)
  }
  
}

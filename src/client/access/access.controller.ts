import { Controller, Query, Get, Post, Body, Patch, Param, Delete, Req, Put, Ip } from '@nestjs/common';
import { AccessService } from './access.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { AccessEntity } from './entities/access.entity';

import { CreateAccessDto } from './dto/create-access.dto';
import { FindAccessListDto } from './dto/find-access-list.dto';

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'

@ApiTags('访问统计模块')
@ApiBearerAuth()
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get('list')
  @ApiOperation({ summary: '查询访问记录列表' })
  @ApiResult(AccessEntity, true, true)
  async findList(@Query() dto: FindAccessListDto): Promise<ResultData> {
    return await this.accessService.findList(dto)
  }

  @Post('web')
  @ApiOperation({ summary: '创建访问记录' })
  @ApiResult()
  async create(@Body() createAccessDto: CreateAccessDto) {
    return await this.accessService.create(createAccessDto);
  }

  @Get('info')
  @ApiOperation({ summary: '根据id查询访问记录' })
  @ApiQuery({ name: 'id' })
  @ApiResult(AccessEntity)
  async findOne(@Query('id') id: string): Promise<ResultData> {
    return this.accessService.findOne(id);
  }
  
}

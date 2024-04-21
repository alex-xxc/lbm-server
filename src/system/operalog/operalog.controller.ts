import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { OperalogService } from './operalog.service'
import { FindOperaListDto } from './dto/find-operalog-list.dto'

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'
import { OperalogEntity } from './entities/operalog.entity'

@ApiTags('操作日志模块')
@ApiBearerAuth()
@Controller('operalog')
export class OperalogController {
  constructor(private readonly operalogService: OperalogService) {}

  @Get('list')
  @ApiOperation({ summary: '查询操作日志列表' })
  @ApiResult(OperalogEntity, true, true)
  async findList(@Query() dto: FindOperaListDto): Promise<ResultData> {
    return await this.operalogService.findList(dto)
  }
  
}

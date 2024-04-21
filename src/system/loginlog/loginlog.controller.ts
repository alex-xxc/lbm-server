import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { LoginlogService } from './loginlog.service';
import { FindLoginListDto } from './dto/find-loginlog-list.dto';

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'
import { LoginlogEntity } from './entities/loginlog.entity';

@ApiTags('登录日志模块')
@ApiBearerAuth()
@Controller('loginlog')
export class LoginlogController {
  constructor(private readonly loginlogService: LoginlogService) {}

  @Get('list')
  @ApiOperation({ summary: '查询登录日志列表' })
  @ApiResult(LoginlogEntity, true, true)
  async findList(@Query() dto: FindLoginListDto): Promise<ResultData> {
    return await this.loginlogService.findList(dto)
  }
}

import { Controller, Get, Body, Req, Put, Ip } from '@nestjs/common';
import { InfoService } from './info.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { InfoEntity } from './entities/info.entity';

import { UpdateInfoDto } from './dto/update-info.dto'

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'

@ApiTags('网站信息模块')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  @ApiOperation({ summary: '查询网站信息' })
  @ApiResult(InfoEntity)
  async findOne(): Promise<ResultData> {
    return this.infoService.findOne();
  }

  @Put()
  @ApiOperation({ summary: '更新网站信息' })
  @ApiResult()
  async update(@Body() updateInfoDto: UpdateInfoDto, @Req() req, @Ip() ip) {
    return await this.infoService.update(updateInfoDto, req.user.account, ip);
  }

}

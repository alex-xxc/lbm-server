import {
  Controller,
  Query,
  Get,
  Param,
  Put,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  Req,
  Ip
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'

import { ClientUserService } from './clientuser.service';
import { CreateClientUserDto } from './dto/create-clientuser.dto';
import { UpdateClientUserDto } from './dto/update-clientuser.dto';
import { UpdateStatusDto } from './dto/update-clientuser-status.dto';
import { FindUserListDto } from './dto/find-clientuser-list.dto';
import { LoginUser } from './dto/login-clientuser.dto';
import { SendMailClientuserDto } from './dto/send-mail-clientuser.dto';

import { UserEntity } from './entities/clientuser.entity'

@ApiTags('客户端用户')
@ApiBearerAuth()
@Controller('clientuser')
export class ClientUserController {
  constructor(private readonly clientuserService: ClientUserService) {}

  @Get('web/info')
  @ApiOperation({ summary: '根据id查询客户端用户信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(UserEntity)
  async findOne(@Query('id') id: string, @Req() req): Promise<ResultData> {
    return await this.clientuserService.findOne(id || req.user.id)
  }

  @Get('list')
  @ApiOperation({ summary: '查询客户端用户列表' })
  @ApiResult(UserEntity, true, true)
  async findList(@Query() dto: FindUserListDto): Promise<ResultData> {
    return await this.clientuserService.findList(dto)
  }

  @Post('web/sign')
  @ApiOperation({ summary: '客户端用户注册' })
  @ApiResult()
  async create(@Body() dto: CreateClientUserDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.clientuserService.create(dto)
  }

  @Put('web')
  @ApiOperation({ summary: '客户端用户更新信息' })
  @ApiResult()
  async update(@Body() dto: UpdateClientUserDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.clientuserService.update(dto, req.user, req.user.account, ip)
  }

  @Put('/status')
  @ApiOperation({ summary: '更改客户端用户可用状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.clientuserService.updateStatus(dto.id, dto.status, req.user.id, req.user.account, ip)
  }

  @Post('sendMail')
  @ApiOperation({ summary: '客户端用户发送邮件' })
  @ApiResult()
  async sendMail(@Body() dto: SendMailClientuserDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.clientuserService.sendMail(dto)
  }

}

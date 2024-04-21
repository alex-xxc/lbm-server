import { Body, Controller, Post, Req, Get, Query, Ip, Headers } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger'

import UA from 'ua-device'

import { ResultData } from '../../common/utils/result'
import { AllowAnon } from '../../common/decorators/allow-anon.decorator'
import { ApiResult } from '../../common/decorators/api-result.decorator'

import { UserEntity } from './user.entity'
import { UserService } from './user.service'

import { LoginUser } from './dto/login-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { CreateTokenDto } from './dto/create-token.dto'

@ApiTags('登录注册')
@Controller()
export class BaseController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResult(UserEntity)
  @AllowAnon()
  async create(@Body() user: CreateUserDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.userService.create(user, req.user.account, ip)
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult(CreateTokenDto)
  @AllowAnon()
  async login(@Body() dto: LoginUser, @Ip() ip, @Headers() header): Promise<ResultData> {

    let newPut = new UA((header['user-agent']));
    let browserData = `${newPut.browser.name} 版本： ${newPut.browser.version.original}` // 浏览器
    let loginSystem = `${newPut.os.name} 版本： ${newPut.os.version.original}` // 系统

    return await this.userService.login(dto.account, dto.password, ip, loginSystem, browserData)
  }

  @Get('loginOut')
  @ApiOperation({ summary: '退出登录' })
  @ApiQuery({ name: 'id' })
  async loginOut(@Query('id') id: string, @Req() req): Promise<ResultData> {
    return await this.userService.loginOut(id || req.user.id)
  }

  @Post('/update/token')
  @ApiOperation({ summary: '刷新token' })
  @ApiResult(CreateTokenDto)
  @ApiBearerAuth()
  async updateToken(@Req() req): Promise<ResultData> {
    return await this.userService.updateToken(req.user.id)
  }
}

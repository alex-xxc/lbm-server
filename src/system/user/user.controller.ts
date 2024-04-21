import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { UserService } from './user.service'
import { UserEntity } from './user.entity'

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'

import { FindUserListDto } from './dto/find-user-list.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateStatusDto } from './dto/update-status.dto'

@ApiTags('用户账号')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: '查询用户列表' })
  @ApiResult(UserEntity, true, true)
  async findList(@Query() dto: FindUserListDto): Promise<ResultData> {
    return await this.userService.findList(dto)
  }

  @Get('one/info')
  @ApiOperation({ summary: '根据id查询用户信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(UserEntity)
  async findOne(@Query('id') id: string, @Req() req): Promise<ResultData> {
    return await this.userService.findOne(id || req.user.id);
  }

  @Post()
  @ApiOperation({ summary: '创建用户信息' })
  @ApiResult()
  async create(@Body() dto: CreateUserDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.userService.create(dto, req.user.account, ip)
  }

  @Put()
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResult()
  async update(@Body() dto: UpdateUserDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.userService.update(dto, req.user, req.user.account, ip)
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改用户可用状态' })
  @ApiResult()
  async updateStatus(@Body() dto: UpdateStatusDto, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.userService.updateStatus(dto.id, dto.status, req.user.id, req.user.account, ip)
  }

  @Put('/password/reset/:userId')
  @ApiOperation({ summary: '重置用户密码' })
  @ApiResult()
  async resetPassword(@Param('userId') userId: string, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.userService.updatePassword(userId, '', true, req.user, req.user.account, ip)
  }

  @Post('/import')
  @ApiOperation({ summary: 'excel 批量导入用户' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResult(UserEntity, true)
  async importUsers(@UploadedFile() file: Express.Multer.File, @Req() req, @Ip() ip): Promise<ResultData> {
    return await this.userService.importUsers(file, req.user.account, ip)
  }
}

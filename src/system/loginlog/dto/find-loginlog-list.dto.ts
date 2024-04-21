import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../../common/utils/req-list-query'

import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../../common/enums/common.enum'

export class FindLoginListDto extends ReqListQuery {
  @ApiProperty({ description: '用户名称', required: false })
  userName?: string

  @ApiProperty({ description: '按登录日志状态查询登录日志', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

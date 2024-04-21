import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../common/utils/req-list-query'

import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../common/enums/common.enum'

export class FindMessageListDto extends ReqListQuery {
  @ApiProperty({ description: '手机号码模糊搜索', required: false })
  phone?: string

  @ApiProperty({ description: '按已读未读状态查询', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

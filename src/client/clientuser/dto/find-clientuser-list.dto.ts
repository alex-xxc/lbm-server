import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../../common/enums/common.enum'
import { ReqListQuery } from '../../../common/utils/req-list-query'

export class FindUserListDto extends ReqListQuery {
  @ApiProperty({ description: '账号模糊搜索', required: false })
  account?: string

  @ApiProperty({ description: '邮箱模糊搜索', required: false })
  email?: string

  @ApiProperty({ description: '姓名模糊搜索', required: false })
  name?: string

  @ApiProperty({ description: '地址模糊搜索', required: false })
  address?: string

  @ApiProperty({ description: '按账号状态查询用户', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

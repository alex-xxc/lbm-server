import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../common/utils/req-list-query'

import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../common/enums/common.enum'

export class FindTagsListDto extends ReqListQuery {
  @ApiProperty({ description: '标题模糊搜索', required: false })
  title?: string

  @ApiProperty({ description: '按内容状态查询', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

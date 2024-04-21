import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../common/utils/req-list-query'

import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../common/enums/common.enum'

export class FindListDto extends ReqListQuery {
  @ApiProperty({ description: '标题模糊搜索', required: false })
  title?: string

  @ApiProperty({ description: '标识码搜索', required: false })
  contentCode?: string

  @ApiProperty({ description: '按状态查询', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

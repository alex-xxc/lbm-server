import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../../common/utils/req-list-query'

import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../../common/enums/common.enum'

export class FindDictListDto extends ReqListQuery {
  @ApiProperty({ description: '字典名称模糊搜索', required: false })
  dictName?: string

  @ApiProperty({ description: '字典类型模糊搜索', required: false })
  dictType?: string

  @ApiProperty({ description: '按状态查询', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

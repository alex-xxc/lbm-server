import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../../common/utils/req-list-query'

import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../../common/enums/common.enum'

export class FindDictDataListDto extends ReqListQuery {
  @ApiProperty({ description: '标签模糊搜索', required: false })
  dictLabel?: string

  @ApiProperty({ description: '键值模糊搜索', required: false })
  dictValue?: string

  @ApiProperty({ description: '字典值搜索', required: false })
  dictType?: string

  @ApiProperty({ description: '按状态查询', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

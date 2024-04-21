import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../../common/utils/req-list-query'

import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../../common/enums/common.enum'

export class FindOperaListDto extends ReqListQuery {
  @ApiProperty({ description: '操作ip模糊搜索', required: false })
  operaIp?: string

  @ApiProperty({ description: '操作人员模糊搜索', required: false })
  operaName?: string

  @ApiProperty({ description: '按操作日志状态查询操作日志', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

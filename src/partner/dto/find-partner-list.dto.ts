import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../common/utils/req-list-query'

import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../common/enums/common.enum'

export class FindPartnerListDto extends ReqListQuery {
  @ApiProperty({ description: '合作伙伴名称模糊搜索', required: false })
  partnerName?: string

  @ApiProperty({ description: '按合作伙伴状态查询合作伙伴户', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}

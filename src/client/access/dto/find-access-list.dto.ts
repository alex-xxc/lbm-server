import { ApiProperty } from '@nestjs/swagger'
import { ReqListQuery } from '../../../common/utils/req-list-query'

export class FindAccessListDto extends ReqListQuery {
  @ApiProperty({ description: '地区模糊搜索', required: false })
  district?: string
}

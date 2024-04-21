import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsIn, IsString } from 'class-validator'
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../common/enums/common.enum'

export class UpdateContentDeleteDto {
  @ApiProperty({ description: 'banner编码' })
  @IsString({ message: 'id 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'id 不能为空' })
  readonly id: string

  @ApiProperty({ description: '所属状态: 1-不删除，0-删除', enum: $enum(StatusValue).getValues() })
  @IsNumber({}, { message: 'delete 类型错误，正确类型 number' })
  @IsNotEmpty({ message: 'delete 不能为空' })
  @IsIn([0, 1], { message: 'delete 可选值0/1，分别表示不删除删除' })
  readonly isDelete: StatusValue
}

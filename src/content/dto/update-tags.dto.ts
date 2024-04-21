import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator'

export class UpdateTagsDto {
    @ApiProperty({ description: '用户编码' })
    @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
    @IsNotEmpty({ message: 'id 不能为空' })
    readonly id: string

    @ApiProperty({ description: '标签名称' })
    @IsNotEmpty({ message: '标签名称不能为空' })
    readonly title: string
}

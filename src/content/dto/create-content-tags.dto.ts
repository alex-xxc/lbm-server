import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTagsDto {
    @ApiProperty({ description: '标签名称' })
    @IsNotEmpty({ message: '标签名称不能为空' })
    readonly title: string
}

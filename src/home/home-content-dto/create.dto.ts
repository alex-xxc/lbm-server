import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateHomeContentDto {
    @ApiProperty({ description: '标题' })
    @IsNotEmpty({ message: '标题不能为空' })
    readonly title: string

    @ApiProperty({ description: '描述' })
    readonly description: string

    @ApiProperty({ description: '跳转链接' })
    readonly url: string

    @ApiProperty({ description: '内容标识' })
    @IsNotEmpty({ message: '内容标识不能为空' })
    readonly code: string

    @ApiProperty({ description: '图片组合' })
    readonly imgs: string

    @ApiProperty({ description: '首页内容状态' })
    readonly status: number
}

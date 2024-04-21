import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBannerDto {
    @ApiProperty({ description: '标题' })
    @IsNotEmpty({ message: '标题不能为空' })
    readonly title: string

    @ApiProperty({ description: '描述' })
    @IsNotEmpty({ message: '描述不能为空' })
    readonly description: string

    @ApiProperty({ description: '跳转链接' })
    readonly url: string

    @ApiProperty({ description: 'banner图', required: false })
    @IsString({ message: 'banner图 类型错误，正确类型-字符串' })
    @IsOptional()
    readonly img?: string

    @ApiProperty({ description: '移动端banner图', required: false })
    @IsString({ message: '移动端banner图 类型错误，正确类型-字符串' })
    @IsOptional()
    readonly wapImg?: string
}

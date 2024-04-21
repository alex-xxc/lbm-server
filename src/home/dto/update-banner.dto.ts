import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator'

export class UpdateBannerDto {
    @ApiProperty({ description: '用户编码' })
    @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
    @IsNotEmpty({ message: 'id 不能为空' })
    readonly id: string

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

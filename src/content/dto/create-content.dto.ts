import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateContentDto {
    @ApiProperty({ description: '内容标题' })
    @IsNotEmpty({ message: '内容标题不能为空' })
    readonly title: string

    @ApiProperty({ description: '内容简介' })
    @IsNotEmpty({ message: '内容简介不能为空' })
    readonly intro: string

    @ApiProperty({ description: '内容seo关键词' })
    @IsNotEmpty({ message: '内容seo关键词不能为空' })
    readonly keyword: string

    @ApiProperty({ description: '内容seo描述' })
    @IsNotEmpty({ message: '内容seo描述不能为空' })
    readonly description: string

    @ApiProperty({ description: '标签 id 集合', required: false })
    @IsString( { each: true, message: '标签id集合中存在类型错误，正确类型 string[]' })
    @IsOptional()
    readonly tags?: string[]
}

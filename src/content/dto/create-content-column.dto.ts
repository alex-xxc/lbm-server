import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateColumnDto {
    @ApiProperty({ description: '栏目标题' })
    @IsNotEmpty({ message: '栏目标题不能为空' })
    readonly title: string

    @ApiProperty({ description: '栏目seo关键词' })
    @IsNotEmpty({ message: '栏目seo关键词不能为空' })
    readonly keyword: string

    @ApiProperty({ description: '栏目seo描述' })
    @IsNotEmpty({ message: '栏目seo描述不能为空' })
    readonly description: string
}

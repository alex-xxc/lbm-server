import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class UpdateListDto {
    @ApiProperty({ description: '编码' })
    @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
    @IsNotEmpty({ message: 'id 不能为空' })
    readonly id: string

    @ApiProperty({ description: '标题' })
    @IsNotEmpty({ message: '标题不能为空' })
    readonly title: string

    @ApiProperty({ description: '描述' })
    readonly description: string

    @ApiProperty({ description: '跳转链接' })
    readonly url: string

    @ApiProperty({ description: '图片组合' })
    readonly imgs: string

    @ApiProperty({ description: '关联内容id' })
    @IsNotEmpty({ message: '内容Id不能为空' })
    readonly contentId: number

    @ApiProperty({ description: '内容标识' })
    @IsNotEmpty({ message: '内容标识不能为空' })
    readonly contentCode: string
}

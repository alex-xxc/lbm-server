import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator'

export class CreateMessageDto {
    @ApiProperty({ description: '用户姓名' })
    @IsNotEmpty({ message: '用户姓名不能为空' })
    readonly name: string

    @ApiProperty({ description: '电话号码' })
    readonly phone: string

    @ApiProperty({ description: '留言ip' })
    readonly messageIp: string

    @ApiProperty({ description: '留言地区' })
    readonly address: string
    
    @ApiProperty({ description: '留言来源' })
    readonly messageUrl: string

    @ApiProperty({ description: '留言咨询的内容名称' })
    readonly contentName: string

    @ApiProperty({ description: '留言咨询的内容id' })
    readonly contentId: string

    @ApiProperty({ description: '邮箱' })
    @IsNotEmpty({ message: '邮箱不能为空' })
    readonly email: string

    @ApiProperty({ description: '留言内容' })
    readonly content: string
}

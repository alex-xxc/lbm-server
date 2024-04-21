import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator'

export class CreateAccessDto {
    @ApiProperty({ description: '客户端访问者Id' })
    readonly userId: string

    @ApiProperty({ description: '客户端访问者名称，无则是游客' })
    readonly userName: string

    @ApiProperty({ description: '客户端访问者邮箱' })
    readonly userEmail: string
    
    @ApiProperty({ description: '访问页面' })
    readonly accessPage: string

    @ApiProperty({ description: '来源网站' })
    readonly sourceSite: string

    @ApiProperty({ description: '地区' })
    readonly district: string

    @ApiProperty({ description: '访问设备' })
    readonly accessEquipment: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator'

export class UpdateInfoDto {
    @ApiProperty({ description: '用户编码' })
    readonly id: string

    @ApiProperty({ description: '网站名称' })
    @IsNotEmpty({ message: '网站名称不能为空' })
    readonly webName: string

    @ApiProperty({ description: '网站描述' })
    readonly description: string

    @ApiProperty({ description: '网站关键词' })
    readonly keywords: string

    @ApiProperty({ description: '品牌名称' })
    readonly brandName: string

    @ApiProperty({ description: '公司名称' })
    @IsNotEmpty({ message: '公司名称不能为空' })
    readonly companyName: string

    @ApiProperty({ description: '公众号名称' })
    readonly wechatPublicName: string

    @ApiProperty({ description: '联系方式', required: false })
    @IsString({ message: '联系方式类型错误，正确类型-字符串' })
    @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入正确的手机号' })
    @IsOptional()
    readonly phone?: string

    @ApiProperty({ description: '邮箱', required: false })
    @IsString({ message: 'email 类型错误，正确类型 string' })
    @IsEmail()
    @IsOptional()
    readonly email?: string

    @ApiProperty({ description: '官方微信号' })
    @IsNotEmpty({ message: '官方微信号不能为空' })
    readonly wechat: string

    @ApiProperty({ description: 'skype' })
    @IsNotEmpty({ message: 'skype不能为空' })
    readonly skype: string

    @ApiProperty({ description: '地址' })
    readonly address: string

    @ApiProperty({ description: '版权' })
    @IsNotEmpty({ message: '版权不能为空' })
    readonly copyright: string

    @ApiProperty({ description: '网站logo', required: false })
    @IsString({ message: 'logo 类型错误，正确类型-字符串' })
    @IsOptional()
    readonly logo?: string

    @ApiProperty({ description: '二维码', required: false })
    @IsString({ message: '二维码 类型错误，正确类型-字符串' })
    @IsOptional()
    readonly qrCode?: string
}

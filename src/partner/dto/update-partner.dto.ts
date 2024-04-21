import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator'

export class UpdatePartnerDto {
    @ApiProperty({ description: '用户编码' })
    @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
    @IsNotEmpty({ message: 'id 不能为空' })
    readonly id: string

    @ApiProperty({ description: '合作伙伴名称' })
    @IsNotEmpty({ message: '合作伙伴名称不能为空' })
    readonly partnerName: string

    @ApiProperty({ description: '合作伙伴手机号', required: false })
    @IsString({ message: '手机号类型错误，正确类型-字符串' })
    @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入正确的手机号' })
    @IsOptional()
    readonly partnerPhone?: string

    @ApiProperty({ description: '合作伙伴联系人', required: false })
    @IsString({ message: '联系人类型错误，正确类型-字符串' })
    @IsOptional()
    readonly partnerUserName?: string

    @ApiProperty({ description: 'logo', required: false })
    @IsString({ message: 'logo 类型错误，正确类型-字符串' })
    @IsOptional()
    readonly logo?: string
}

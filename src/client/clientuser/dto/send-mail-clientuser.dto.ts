import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class SendMailClientuserDto {
  @ApiProperty({ description: '客户端用户接收的邮箱', required: false })
  @IsString({ message: 'receiveEmail 类型错误，正确类型 string' })
  @IsEmail()
  readonly receiveEmail?: string

  @ApiProperty({ description: '邮件营销语', required: false })
  @IsString({ message: '邮件营销语类型错误，正确类型 string' })
  readonly emailMarketing?: string

  @ApiProperty({ description: '邮件内容错误', required: false })
  @IsString({ message: '邮件内容，正确类型 string' })
  readonly content?: string
}

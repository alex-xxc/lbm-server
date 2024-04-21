import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMobilePhone, IsNumberString, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateClientUserDto {
  @ApiProperty({ description: '用户编码' })
  @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'id 不能为空' })
  readonly id: string

  @ApiProperty({ description: '用户账号' })
  @IsString({ message: 'account 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'account cannot be empty' })
  @MinLength(5, { message: 'account must be at least 5 characters long' })
  @MaxLength(20, { message: 'account maximum 20 characters' })
  readonly account: string

  @ApiProperty({ description: '手机号', required: false })
  @IsString({ message: 'phoneNum 类型错误，正确类型 string' })
  @IsOptional()
  readonly phoneNum?: string

  @ApiProperty({ description: '邮箱', required: false })
  @IsString({ message: 'email 类型错误，正确类型 string' })
  @IsEmail()
  @IsOptional()
  readonly email?: string

  @ApiProperty({ description: '确认密码' })
  @IsString({ message: ' confirmPassword 类型错误，正确类型 string' })
  readonly confirmPassword: string
}

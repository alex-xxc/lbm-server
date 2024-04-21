import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateClientUserDto {
  @ApiProperty({ description: '用户账号' })
  @IsString({ message: 'account 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'account cannot be empty' })
  @MinLength(5, { message: 'account must be at least 5 characters long' })
  @MaxLength(20, { message: 'account maximum 20 characters' })
  readonly account: string

  @ApiProperty({ description: '密码' })
  @IsString({ message: 'password 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'password 不能为空' })
  password: string

  @ApiProperty({ description: '姓名', required: false })
  @IsString({ message: '姓名类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  readonly name?: string

  @ApiProperty({ description: '手机号', required: false })
  @IsString({ message: 'phoneNum 类型错误，正确类型 string' })
  readonly phoneNum?: string

  @ApiProperty({ description: '邮箱', required: false })
  @IsString({ message: 'email 类型错误，正确类型 string' })
  @IsEmail()
  readonly email?: string

  @ApiProperty({ description: '地址', required: false })
  @IsString({ message: '地址类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'address cannot be empty' })
  readonly address?: string

  @ApiProperty({ description: '确认密码' })
  @IsString({ message: ' confirmPassword 类型错误，正确类型 string' })
  readonly confirmPassword: string
}

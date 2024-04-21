import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateDictDto {
    @ApiProperty({ description: '字典名称' })
    @IsNotEmpty({ message: '字典名称不能为空' })
    readonly dictName: string

    @ApiProperty({ description: '字典类型' })
    @IsNotEmpty({ message: '字典类型不能为空' })
    readonly dictType: string

    @ApiProperty({ description: '字典描述' })
    readonly description: string

    @ApiProperty({ description: '字典状态' })
    readonly status: number

    @ApiProperty({ description: '字典内容' })
    readonly content: string
}

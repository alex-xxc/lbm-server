import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator'

export class UpdateDictDto {
    @ApiProperty({ description: '字典编码' })
    @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
    @IsNotEmpty({ message: 'id 不能为空' })
    readonly id: string

    @ApiProperty({ description: '字典名称' })
    @IsNotEmpty({ message: '字典名称不能为空' })
    readonly dictName: string

    @ApiProperty({ description: '字典描述' })
    readonly description: string

    @ApiProperty({ description: '字典状态' })
    readonly status: number

    @ApiProperty({ description: '字典类型' })
    @IsNotEmpty({ message: '字典类型不能为空' })
    readonly dictType: string
}

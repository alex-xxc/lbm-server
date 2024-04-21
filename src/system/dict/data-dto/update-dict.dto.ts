import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator'

export class UpdateDictDataDto {
    @ApiProperty({ description: '字典编码' })
    @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
    @IsNotEmpty({ message: 'id 不能为空' })
    readonly id: string

    @ApiProperty({ description: '标签' })
    @IsNotEmpty({ message: '标签不能为空' })
    readonly dictLabel: string

    @ApiProperty({ description: '字典键值' })
    @IsNotEmpty({ message: '字典键值不能为空' })
    readonly dictValue: string

    @ApiProperty({ description: '描述' })
    readonly description: string

    @ApiProperty({ description: '状态' })
    readonly status: number

    @ApiProperty({ description: '内容' })
    readonly content: string

    @ApiProperty({ description: '关联字典id' })
    @IsNotEmpty({ message: '字典Id不能为空' })
    readonly dictId: number

    @ApiProperty({ description: '关联字典类型' })
    @IsNotEmpty({ message: '字典类型不能为空' })
    readonly dictType: string
}

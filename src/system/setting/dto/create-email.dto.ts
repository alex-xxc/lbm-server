import { ApiProperty } from '@nestjs/swagger'

export class EmailDto {
    @ApiProperty({ description: '测试内容' })
    readonly content: string
}

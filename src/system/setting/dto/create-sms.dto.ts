import { ApiProperty } from '@nestjs/swagger'

export class SmsDto {
    @ApiProperty({ description: '测试手机号码' })
    readonly phone: number
}

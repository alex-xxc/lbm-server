import { ApiProperty } from '@nestjs/swagger'

export class UpdateSettingDto {
    @ApiProperty({ description: '编码' })
    readonly id: string

    @ApiProperty({ description: '邮箱授权码' })
    readonly emailCode: string

    @ApiProperty({ description: '发送邮件的邮箱' })
    readonly emailMail: string

    @ApiProperty({ description: '接收邮件的邮箱' })
    readonly receiveMail: string

    @ApiProperty({ description: '邮件端口465或587' })
    readonly emailPort: number

    @ApiProperty({ description: '短信AccessKey' })
    readonly smsAccessKey: string
    
    @ApiProperty({ description: '短信Access密钥' })
    readonly smsAccessSecret: string
    
    @ApiProperty({ description: '短信签名' })
    readonly smsSignName: string

    @ApiProperty({ description: '短信模板code' })
    readonly smsCode: string

    @ApiProperty({ description: 'OSS的AccessKey' })
    readonly ossAccessKey: string

    @ApiProperty({ description: 'OSS的Access密钥' })
    readonly ossAccessSecret: string

    @ApiProperty({ description: 'OSS的region' })
    readonly ossRegion: string

    @ApiProperty({ description: 'OSS的bucket' })
    readonly ossBucket: string
}

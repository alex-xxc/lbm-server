import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Entity('sys_setting')
export class SettingEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '邮箱授权码' })
    @Column({ type: 'varchar', default: '', name: 'email_code', length: 255, comment: '邮箱授权码' })
    public emailCode: string

    @ApiProperty({ type: String, description: '发送邮件的邮箱' })
    @Column({ type: 'varchar', default: '', name: 'email_mail', length: 255, comment: '发送邮件的邮箱' })
    public emailMail: string

    @ApiProperty({ type: String, description: '接收邮件的邮箱' })
    @Column({ type: 'varchar', default: '', name: 'receive_mail', length: 255, comment: '发送邮件的邮箱' })
    public receiveMail: string

    @ApiProperty({ type: String, description: '邮件端口465或587' })
    @Column({ type: 'decimal', default: 587, name: 'email_port', comment: '邮件端口465或587' })
    public emailPort: number

    @ApiProperty({ type: String, description: '邮件营销语' })
    @Column({ type: 'varchar', default: '', name: 'email_marketing', length: 2000, comment: '邮件营销语' })
    public emailMarketing: string

    @ApiProperty({ type: String, description: '短信AccessKey' })
    @Column({ type: 'varchar', default: '', name: 'sms_access_key', length: 255, comment: '短信AccessKey' })
    public smsAccessKey: string

    @ApiProperty({ type: String, description: '短信Access密钥' })
    @Column({ type: 'varchar', default: '', name: 'sms_access_secret', length: 255, comment: '短信Access密钥' })
    public smsAccessSecret: string

    @ApiProperty({ type: String, description: '短信签名' })
    @Column({ type: 'varchar', default: '', name: 'sms_sign_name', length: 255, comment: '短信签名' })
    public smsSignName: string
    
    @ApiProperty({ type: String, description: '短信模板code' })
    @Column({ type: 'varchar', default: '', name: 'sms_code', length: 255, comment: '短信模板code' })
    public smsCode: string

    @ApiProperty({ type: String, description: 'OSS的AccessKey' })
    @Column({ type: 'varchar', default: '', name: 'oss_access_key', length: 255, comment: 'OSS的AccessKey' })
    public ossAccessKey: string

    @ApiProperty({ type: String, description: 'OSS的Access密钥' })
    @Column({ type: 'varchar', default: '', name: 'oss_access_secret', length: 255, comment: 'OSS的Access密钥' })
    public ossAccessSecret: string

    @ApiProperty({ type: String, description: 'OSS的region' })
    @Column({ type: 'varchar', default: '', name: 'oss_region', length: 255, comment: 'oss的region' })
    public ossRegion: string
    
    @ApiProperty({ type: String, description: 'OSS的bucket' })
    @Column({ type: 'varchar', default: '', name: 'oss_bucket', length: 255, comment: 'oss的bucket' })
    public ossBucket: string

    @ApiProperty({ type: String, description: '快递鸟用户id' })
    @Column({ type: 'varchar', default: '', name: 'logistics_user_id', length: 255, comment: '快递鸟用户id' })
    public logisticsUserId: string

    @ApiProperty({ type: String, description: '快递鸟API的key' })
    @Column({ type: 'varchar', default: '', name: 'logistics_key', length: 500, comment: '快递鸟API的key' })
    public logisticsKey: string

    @ApiProperty({ type: Date, description: '创建时间' })
    @Exclude({ toPlainOnly: true })
    @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
    createDate: Date

    @ApiProperty({ type: Date, description: '更新时间' })
    @Exclude({ toPlainOnly: true })
    @UpdateDateColumn({ type: 'timestamp', name: 'update_date', comment: '更新时间' })
    updateDate: Date
}

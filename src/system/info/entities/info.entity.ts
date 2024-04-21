import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Entity('web_info')
export class InfoEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '网站名称' })
    @Column({ type: 'varchar', default: '网站名称', name: 'web_name', length: 255, comment: '网站名称' })
    public webName: string

    @ApiProperty({ type: String, description: '网站描述' })
    @Column({ type: 'varchar', default: '网站描述', name: 'description', length: 255, comment: '网站名称' })
    public description: string

    @ApiProperty({ type: String, description: '网站关键词' })
    @Column({ type: 'varchar', default: '网站关键词', name: 'keywords', length: 255, comment: '网站名称' })
    public keywords: string

    @ApiProperty({ type: String, description: '品牌名称' })
    @Column({ type: 'varchar', default: '品牌名称', name: 'brand_name', length: 255, comment: '品牌名称' })
    public brandName: string

    @ApiProperty({ type: String, description: '公司名称' })
    @Column({ type: 'varchar', default: '公司名称', name: 'company_name', length: 255, comment: '公司名称' })
    public companyName: string

    @ApiProperty({ type: String, description: '公众号名称' })
    @Column({ type: 'varchar', name: 'wechat_public_name', length: 255, comment: '公众号名称' })
    public wechatPublicName: string

    @ApiProperty({ type: String, description: '联系方式' })
    @Column({ type: 'varchar', name: 'phone', length: 255, comment: '联系方式' })
    public phone: string

    @ApiProperty({ type: String, description: '邮箱' })
    @Column({ type: 'varchar', name: 'email', length: 255, comment: '邮箱' })
    public email: string

    @ApiProperty({ type: String, description: '官方微信号' })
    @Column({ type: 'varchar', name: 'wechat', length: 255, comment: '官方微信号' })
    public wechat: string

    @ApiProperty({ type: String, description: 'skype' })
    @Column({ type: 'varchar', name: 'skype', length: 500, comment: 'skype' })
    public skype: string

    @ApiProperty({ type: String, description: '地址' })
    @Column({ type: 'varchar', name: 'address', length: 255, comment: '地址' })
    public address: string

    @ApiProperty({ type: String, description: '版权' })
    @Column({ type: 'varchar', name: 'copyright', length: 255, comment: '版权' })
    public copyright: string

    @ApiProperty({ type: String, description: '网站logo' })
    @Column({ type: 'varchar', default: '', comment: '网站logo' })
    public logo: string

    @ApiProperty({ type: String, description: '二维码' })
    @Column({ type: 'varchar', default: '', name: 'qr_code', comment: '二维码' })
    public qrCode: string

    @ApiProperty({ type: Date, description: '创建时间' })
    @Exclude({ toPlainOnly: true })
    @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
    createDate: Date

    @ApiProperty({ type: Date, description: '更新时间' })
    @Exclude({ toPlainOnly: true })
    @UpdateDateColumn({ type: 'timestamp', name: 'update_date', comment: '更新时间' })
    updateDate: Date
}

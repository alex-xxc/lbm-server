import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { Exclude } from 'class-transformer'
import { StatusValue } from '../../../common/enums/common.enum'

@Entity('client_access')
export class AccessEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '客户端用户id' })
    @Column({ type: 'varchar', name: 'user_id', length: 255, comment: '客户端用户id' })
    public userId: string

    @ApiProperty({ type: String, description: '客户端用户姓名，无则是游客' })
    @Column({ type: 'varchar', name: 'user_name', length: 255, comment: '客户端用户姓名，无则是游客' })
    public userName: string

    @ApiProperty({ type: String, description: '客户端用户邮箱' })
    @Column({ type: 'varchar', name: 'user_email', length: 255, comment: '客户端用户邮箱' })
    public userEmail: string

    @ApiProperty({ type: String, description: '访问页面' })
    @Column({ type: 'varchar', name: 'access_page', length: 255, comment: '访问页面' })
    public accessPage: string

    @ApiProperty({ type: String, description: '来源网站' })
    @Column({ type: 'varchar', name: 'source_site', length: 255, comment: '来源网站' })
    public sourceSite: string

    @ApiProperty({ type: String, description: '地区' })
    @Column({ type: 'varchar', name: 'district', length: 255, comment: '地区' })
    public district: string

    @ApiProperty({ type: String, description: '访问设备' })
    @Column({ type: 'varchar', name: 'access_equipment', length: 255, comment: '访问设备' })
    public accessEquipment: string

    @Column({ type: 'bigint', name: 'content_id', comment: '内容id' })
    @Exclude({ toPlainOnly: true })
    public contentId: string

    @ApiProperty({ type: String, description: '所属状态: 1-内容页，0-不是内容页', enum: $enum(StatusValue).getValues() })
    @Column({ type: 'tinyint', default: 0, name: 'is_content', comment: '所属状态: 1-内容页，0-不是内容页' })
    public isContent: StatusValue

    @ApiProperty({ type: Date, description: '创建时间' })
    @CreateDateColumn({ type: 'timestamp', name:'create_date', comment: '创建时间' })
    createDate: Date

    @ApiProperty({ type: Date, description: '更新时间' })
    @Exclude({ toPlainOnly: true })
    @UpdateDateColumn({ type: 'timestamp', name:'update_date', comment: '更新时间' })
    updateDate: Date
}

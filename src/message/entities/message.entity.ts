import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { Exclude } from 'class-transformer'
import { StatusValue } from '../../common/enums/common.enum'

@Entity('message')
export class MessageEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '用户姓名/游客' })
    @Column({ type: 'varchar', name:'name', length: 255, comment: '用户姓名/游客' })
    public name: string

    @ApiProperty({ type: String, description: '电话号码' })
    @Column({ type: 'varchar', name:'phone', length: 255, comment: '电话号码' })
    public phone: string

    @ApiProperty({ type: String, description: '邮箱' })
    @Column({ type: 'varchar', name:'email', length: 255, comment: '邮箱' })
    public email: string

    @ApiProperty({ type: String, description: '留言ip' })
    @Column({ type: 'varchar', name:'message_ip', length: 255, comment: '留言ip' })
    public messageIp: string

    @ApiProperty({ type: String, description: '留言地区' })
    @Column({ type: 'varchar', name:'address', length: 255, comment: '留言地区' })
    public address: string

    @ApiProperty({ type: String, description: '留言来源' })
    @Column({ type: 'varchar', name:'message_url', length: 550, comment: '留言来源' })
    public messageUrl: string

    @ApiProperty({ type: String, description: '留言内容名称/无则为空' })
    @Column({ type: 'varchar', name:'content_name', default: '', length: 550, comment: '留言内容名称/无则为空' })
    public contentName: string

    @ApiProperty({ type: String, description: '留言内容id/无则为空' })
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar', name:'content_id', default: '', length: 225, comment: '留言内容id/无则为空' })
    public contentId: string

    @ApiProperty({ type: String, description: '留言内容' })
    @Column({ type: 'varchar', name:'content', length: 1000, comment: '留言内容' })
    public content: string

    @ApiProperty({ type: String, description: '所属状态: 1-已读，0-未读', enum: $enum(StatusValue).getValues() })
    @Column({ type: 'tinyint', name: 'status', default: 0, comment: '阅读状态 1-已读，0-未读' })
    public status: StatusValue

    @ApiProperty({ type: String, description: '所属状态: 1-不删除，0-删除', enum: $enum(StatusValue).getValues() })
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'tinyint', name:'is_delete', default: StatusValue.NORMAL, comment: '所属删除逻辑: 1-不删除，0-删除' })
    public isDelete: StatusValue

    @ApiProperty({ type: Date, description: '创建时间' })
    @CreateDateColumn({ type: 'timestamp', name:'create_date', comment: '创建时间' })
    createDate: Date

    @ApiProperty({ type: Date, description: '更新时间' })
    @Exclude({ toPlainOnly: true })
    @UpdateDateColumn({ type: 'timestamp', name:'update_date', comment: '更新时间' })
    updateDate: Date
}

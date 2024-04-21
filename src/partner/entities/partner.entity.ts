import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { Exclude } from 'class-transformer'
import { StatusValue } from '../../common/enums/common.enum'

@Entity('partner')
export class PartnerEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '合作伙伴名称' })
    @Column({ type: 'varchar', name: 'partner_name', length: 255, comment: '合作伙伴名称' })
    public partnerName: string

    @ApiProperty({ type: String, description: '合作伙伴手机号' })
    @Column({ type: 'varchar', name: 'partner_phone', length: 255, comment: '合作伙伴手机号' })
    public partnerPhone: string

    @ApiProperty({ type: String, description: '合作伙伴联系人' })
    @Column({ type: 'varchar', name: 'partner_user_name', length: 255, comment: '合作伙伴联系人' })
    public partnerUserName: string

    @ApiProperty({ type: String, description: '合作伙伴logo' })
    @Column({ type: 'varchar', comment: '合作伙伴logo' })
    public logo: string

    @ApiProperty({ type: String, description: '所属状态: 1-有效，0-禁用', enum: $enum(StatusValue).getValues() })
    @Column({ type: 'tinyint', default: StatusValue.NORMAL, comment: '所属状态: 1-展示，0-隐藏' })
    public status: StatusValue

    @ApiProperty({ type: Date, description: '创建时间' })
    @CreateDateColumn({ type: 'timestamp', name:'create_date', comment: '创建时间' })
    createDate: Date

    @ApiProperty({ type: Date, description: '更新时间' })
    @Exclude({ toPlainOnly: true })
    @UpdateDateColumn({ type: 'timestamp', name:'update_date', comment: '更新时间' })
    updateDate: Date

    @ApiProperty({ type: String, description: '所属状态: 1-不删除，0-删除', enum: $enum(StatusValue).getValues() })
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'tinyint', name:'is_delete', default: StatusValue.NORMAL, comment: '所属删除逻辑: 1-不删除，0-删除' })
    public isDelete: StatusValue
}

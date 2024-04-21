import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { Exclude } from 'class-transformer'

import { StatusValue } from '../../common/enums/common.enum'

@Entity('home_content')
export class HomeContentEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '标题' })
    @Column({ type: 'varchar', name: 'title', length: 255, comment: '标题' })
    public title: string

    @ApiProperty({ type: String, description: '描述' })
    @Column({ type: 'varchar', name: 'description', length: 500, comment: '描述' })
    public description: string

    @ApiProperty({ type: String, description: '跳转链接' })
    @Column({ type: 'varchar', name: 'url', length: 500, comment: '跳转链接' })
    public url: string

    @ApiProperty({ type: String, description: '内容标识' })
    @Column({ type: 'varchar', name: 'code', length: 500, comment: '内容标识' })
    public code: string

    @ApiProperty({ type: String, description: '图片组合' })
    @Column({ type: 'text', comment: '图片组合' })
    public imgs: string

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

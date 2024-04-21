import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../../common/enums/common.enum'

@Entity('sys_dict_data')
export class DictDataEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '标签' })
    @Column({ type: 'varchar', name: 'dict_label', length: 255, comment: '名称' })
    public dictLabel: string

    @ApiProperty({ type: String, description: '键值' })
    @Column({ type: 'varchar', name: 'dict_value', length: 255, comment: '键值' })
    public dictValue: string

    @ApiProperty({ type: String, description: '描述' })
    @Column({ type: 'varchar', name: 'description', length: 400, comment: '描述' })
    public description: string

    @ApiProperty({ type: String, description: '内容' })
    @Column({ type: 'varchar', name: 'content', length: 600, comment: '内容' })
    public content: string

    @ApiProperty({ type: String, description: '字典Id' })
    @Column({ type: 'varchar', name: 'dict_id', comment: '字典Id' })
    public dictId: string

    @ApiProperty({ type: String, description: '字典标识' })
    @Column({ type: 'varchar', name: 'dict_type', comment: '字典标识' })
    public dictType: string

    @ApiProperty({ type: String, description: '所属状态: 1-有效，0-禁用', enum: $enum(StatusValue).getValues() })
    @Column({ type: 'tinyint', default: StatusValue.NORMAL, comment: '所属状态: 1-有效，0-禁用' })
    public status: StatusValue

    @ApiProperty({ type: Date, description: '创建时间' })
    @CreateDateColumn({ type: 'timestamp', name:'create_date', comment: '创建时间' })
    createDate: Date

    @ApiProperty({ type: Date, description: '更新时间' })
    @UpdateDateColumn({ type: 'timestamp', name:'update_date', comment: '更新时间' })
    updateDate: Date

    @ApiProperty({ type: String, description: '所属状态: 1-不删除，0-删除', enum: $enum(StatusValue).getValues() })
    @Column({ type: 'tinyint', name:'is_delete', default: StatusValue.NORMAL, comment: '所属删除逻辑: 1-不删除，0-删除' })
    public isDelete: StatusValue

}

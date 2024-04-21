import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../../common/enums/common.enum'

@Entity('sys_operalog')
export class OperalogEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '系统菜单' })
    @Column({ type: 'varchar', name: 'system_menu', length: 255, comment: '系统菜单' })
    public systemMenu: string

    @ApiProperty({ type: String, description: '操作模块' })
    @Column({ type: 'varchar', name: 'opera_module', length: 255, comment: '操作模块' })
    public operaModule: string

    @ApiProperty({ type: String, description: '操作人员' })
    @Column({ type: 'varchar', name: 'opera_name', length: 255, comment: '操作人员' })
    public operaName: string

    @ApiProperty({ type: String, description: '操作IP' })
    @Column({ type: 'varchar', name: 'opera_ip', length: 255, comment: '操作IP' })
    public operaIp: string

    @ApiProperty({ type: String, description: '所属状态: 1-成功，0-失败', enum: $enum(StatusValue).getValues() })
    @Column({ type: 'tinyint', default: StatusValue.NORMAL, comment: '所属状态: 1-成功，0-失败' })
    public status: StatusValue

    @ApiProperty({ type: Date, description: '创建时间' })
    @CreateDateColumn({ type: 'timestamp', name:'create_date', comment: '创建时间' })
    createDate: Date
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { Exclude } from 'class-transformer'
import { StatusValue } from '../../../common/enums/common.enum'

@Entity('sys_loginlog')
export class LoginlogEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '用户名称' })
    @Column({ type: 'varchar', name: 'user_name', length: 255, comment: '用户名称' })
    public userName: string

    @ApiProperty({ type: String, description: '登录IP' })
    @Column({ type: 'varchar', name: 'login_ip', length: 255, comment: '登录IP' })
    public loginIp: string

    @ApiProperty({ type: String, description: '登录地点' })
    @Column({ type: 'varchar', name: 'login_address', length: 255, comment: '登录地点' })
    public loginAddress: string

    @ApiProperty({ type: String, description: '登录浏览器' })
    @Column({ type: 'varchar', name: 'login_browser', length: 510, comment: '登录浏览器' })
    public loginBrowser: string

    @ApiProperty({ type: String, description: '登录系统' })
    @Column({ type: 'varchar', name: 'login_system', length: 255, comment: '登录系统' })
    public loginSystem: string

    @ApiProperty({ type: String, description: '所属状态: 1-成功，0-失败', enum: $enum(StatusValue).getValues() })
    @Column({ type: 'tinyint', default: StatusValue.NORMAL, comment: '所属状态: 1-成功，0-失败' })
    public status: StatusValue

    @ApiProperty({ type: Date, description: '创建时间' })
    @CreateDateColumn({ type: 'timestamp', name:'create_date', comment: '创建时间' })
    createDate: Date
}

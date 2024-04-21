import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { Exclude } from 'class-transformer'

import { StatusValue } from '../../common/enums/common.enum'

@Entity('column')

export class ColumnEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '栏目标题' })
    @Column({ type: 'varchar', name: 'title', length: 255, comment: '栏目标题' })
    public title: string

    @ApiProperty({ type: String, description: '栏目副标题' })
    @Column({ type: 'varchar', name: 'subhead', length: 255, comment: '栏目副标题' })
    public subhead: string

    @ApiProperty({ type: String, description: '栏目类型' })
    @Column({ type: 'varchar', name: 'type', default: 'page', length: 255, comment: '栏目类型' })
    public type: string

    @ApiProperty({ type: String, description: '栏目模板' })
    @Column({ type: 'varchar', name: 'template',  length: 255, comment: '栏目模板' })
    public template: string

    @ApiProperty({ type: String, description: '栏目banner' })
    @Column({ type: 'varchar', comment: '栏目banner' })
    public img: string
    
    @ApiProperty({ type: String, description: '栏目seo关键词' })
    @Column({ type: 'varchar', name: 'keyword', length: 255, comment: '栏目seo关键词' })
    public keyword: string
    
    @ApiProperty({ type: String, description: '栏目seo描述' })
    @Column({ type: 'varchar', name: 'description', length: 255, comment: '栏目seo描述' })
    public description: string

    @ApiProperty({ type: String, description: '栏目内容' })
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'text', default: null, name: 'content', comment: '栏目内容' })
    public content: string

    @ApiProperty({ type: String, description: '栏目父级id' })
    @Column({ type: 'bigint', name: 'parent_id', comment: '栏目父级id' })
    public parentId: string

    @ApiProperty({ type: String, description: '栏目排序' })
    @Column({ type: 'int', name: 'order_num', comment: '栏目排序' })
    public orderNum: string

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
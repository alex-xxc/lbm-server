import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinTable, ManyToOne, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { Exclude } from 'class-transformer'
import { StatusValue } from '../../common/enums/common.enum'

@Entity('content')

export class ContentEntity {
    @ApiProperty({ type: String, description: 'id' })
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: string

    @ApiProperty({ type: String, description: '内容标题' })
    @Column({ type: 'varchar', name: 'title', length: 2000, comment: '内容标题' })
    public title: string

    @ApiProperty({ type: String, description: '内容简介' })
    @Column({ type: 'varchar', name: 'intro', length: 2000, comment: '内容简介' })
    public intro: string

    @ApiProperty({ type: String, description: '内容栏目' })
    @Column({ type: 'varchar', name: 'column_id', length: 255, comment: '内容栏目' })
    public columnId: string

    @ApiProperty({ type: String, description: '内容推荐/头条' })
    @Column({ type: 'varchar', name: 'recom', length: 255, comment: '内容推荐/头条' })
    public recom: string

    @ApiProperty({ type: Date, description: '内容发布时间' })
    @Column({ type: 'varchar', name: 'publish_date', length: 255, comment: '内容发布时间' })
    public publishDate: Date

    @ApiProperty({ type: String, description: '内容价格' })
    @Column({ type: 'varchar', name: 'price', comment: '内容价格' })
    public price: string

    @ApiProperty({ type: String, description: '内容原价' })
    @Column({ type: 'varchar', name: 'original_price', comment: '内容原价' })
    public originalPrice: string

    @ApiProperty({ type: String, description: '内容封面图片组' })
    @Column({ type: 'text', comment: '内容封面图片组' })
    public img: string

    @ApiProperty({ type: String, description: '内容详情' })
    @Column({ type: 'text', default: null, name: 'content', comment: '内容详情' })
    public content: string

    @ApiProperty({ type: String, description: '内容seo关键词' })
    @Column({ type: 'varchar', name: 'keyword', length: 500, comment: '内容seo关键词' })
    public keyword: string

    @ApiProperty({ type: String, description: '内容seo描述' })
    @Column({ type: 'varchar', name: 'description', length: 1000, comment: '内容seo描述' })
    public description: string

    @ApiProperty({ type: String, description: '内容排序' })
    @Column({ type: 'int', name: 'order_num', comment: '内容排序' })
    public orderNum: string

    @ApiProperty({ type: String, description: '访问量' })
    @Column({ type: 'int', name: 'read_num', default: 0, comment: '访问量' })
    public readNum: string

    @ApiProperty({ type: String, description: '咨询量' })
    @Column({ type: 'int', name: 'consult_num', default: 0, comment: '咨询量' })
    public consultNum: string

    @ApiProperty({ type: Number, description: '收藏量' })
    @Column({ type: 'int', name: 'collect_num', default: 0, comment: '收藏量' })
    public collectNum: number

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

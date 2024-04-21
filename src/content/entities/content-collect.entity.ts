import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinTable, ManyToOne, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'
import { StatusValue } from '../../common/enums/common.enum'

@Entity('content_collect')
export class ContentCollectEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @Column({ type: 'bigint', name: 'content_id', comment: '内容id' })
  contentId: string

  @Column({ type: 'bigint', name: 'user_id', comment: '客户端用户id' })
  userId: string

  @Column({ type: 'varchar', name: 'user_name', comment: '用户姓名' })
  userName: string

  @ApiProperty({ type: String, description: '所属状态: 1-收藏，0-没收藏', enum: $enum(StatusValue).getValues() })
  @Column({ type: 'tinyint', default: StatusValue.NORMAL, comment: '所属状态: 1-收藏，0-没收藏' })
  public collect: StatusValue
}

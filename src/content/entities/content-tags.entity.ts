import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('content_tags')
export class ContentTagsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @Column({ type: 'bigint', name: 'content_id', comment: '内容id' })
  contentId: string

  @Column({ type: 'bigint', name: 'tags_id', comment: '标签id' })
  tagsId: string
}

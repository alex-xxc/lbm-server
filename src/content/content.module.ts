import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ContentService } from './content.service'
import { ContentTagsService } from './content-tags.service'

import { ContentController } from './content.controller'
import { ContentEntity } from './entities/content.entity'
import { TagsEntity } from './entities/tags.entity'
import { ContentTagsEntity } from './entities/content-tags.entity'
import { ContentCollectEntity } from './entities/content-collect.entity'
import { ColumnEntity } from './entities/column.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentEntity, TagsEntity, ColumnEntity, ContentTagsEntity, ContentCollectEntity])
  ],
  controllers: [ContentController],
  providers: [ContentService, ContentTagsService]
})
export class ContentModule {}

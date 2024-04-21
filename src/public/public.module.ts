import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from '../client/clientuser/entities/clientuser.entity'
import { MessageEntity } from '../message/entities/message.entity';
import { AccessEntity } from '../client/access/entities/access.entity';

import { PublicService } from './public.service';
import { WsAiService } from '../common/ws/ws.service';
import { PublicController } from './public.controller';
import { ContentEntity } from '../content/entities/content.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MessageEntity, AccessEntity, ContentEntity])],
  controllers: [PublicController],
  providers: [PublicService, WsAiService],
  exports: [PublicService]
})
export class PublicModule {}

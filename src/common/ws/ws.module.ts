import { Global, Module } from '@nestjs/common';
import { WsAiService } from './ws.service'

@Global()
@Module({
  providers: [WsAiService],
})
export class WsModule {}

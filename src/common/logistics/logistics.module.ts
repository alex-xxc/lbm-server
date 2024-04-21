import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { LogisticsService } from './logistics.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [LogisticsService],
  exports: [LogisticsService]
})
export class LogisticsModule {}

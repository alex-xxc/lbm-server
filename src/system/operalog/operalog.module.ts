import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { OperalogService } from './operalog.service'
import { OperalogController } from './operalog.controller'
import { OperalogEntity } from './entities/operalog.entity'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OperalogEntity])],
  controllers: [OperalogController],
  providers: [OperalogService],
  exports: [OperalogService]
})
export class OperalogModule {}

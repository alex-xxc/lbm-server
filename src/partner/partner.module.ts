import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PartnerService } from './partner.service'
import { PartnerController } from './partner.controller'
import { PartnerEntity } from './entities/partner.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PartnerEntity])],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}

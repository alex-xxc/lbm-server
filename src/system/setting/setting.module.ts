import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SettingService } from './setting.service'
import { GetSettingService } from './get.setting.service'
import { SettingController } from './setting.controller'
import { SettingEntity } from './entities/setting.entity'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  controllers: [SettingController],
  providers: [SettingService, GetSettingService],
  exports: [GetSettingService]
})
export class SettingModule {}

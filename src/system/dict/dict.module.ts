import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DictService } from './dict.service';
import { DictDataService } from './dict-data.service';
import { DictController } from './dict.controller';
import { DictDataController } from './dict-data.controller';
import { DictEntity } from './entities/dict.entity'
import { DictDataEntity } from './entities/dict-data.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DictEntity, DictDataEntity])],
  controllers: [ DictController, DictDataController],
  providers: [ DictService, DictDataService],
})
export class DictModule {}

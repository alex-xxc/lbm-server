import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { SettingEntity } from './entities/setting.entity'

@Injectable()
export class GetSettingService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepo: Repository<SettingEntity>,
  ) {}

  async findOneInfo() {
    let id = '1'
    let settingInfo = await this.settingRepo.findOne({ where: { id } });

    settingInfo = plainToInstance(SettingEntity, { ...settingInfo }, { enableImplicitConversion: true })
    return settingInfo
  }
}

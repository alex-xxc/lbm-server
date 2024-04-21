import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Like, Repository, In, EntityManager } from 'typeorm'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { InfoEntity } from './entities/info.entity'

import { ResultData } from '../../common/utils/result'

import { UpdateInfoDto } from './dto/update-info.dto'

import { OperalogService } from 'src/system/operalog/operalog.service'

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(InfoEntity)
    private readonly infoRepo: Repository<InfoEntity>,
    @InjectEntityManager()
    private readonly infoManager: EntityManager,
    private readonly operalogService: OperalogService,
  ) {}

  async findOneInfo() {
    let id = '1'
    let webInfo = await this.infoRepo.findOne({ where: { id } });

    webInfo = plainToInstance(InfoEntity, { ...webInfo }, { enableImplicitConversion: true })
    return webInfo
  }

  /** 查询网站信息 */
  async findOne() {
    const webInfo = await this.findOneInfo();
    return ResultData.ok(instanceToPlain(webInfo))
  }

  /** 更新网站信息 */
  async update(updateInfoDto: UpdateInfoDto, account: String, ip: String) {
    const infoData = await this.findOneInfo();

    if (!infoData) {
      // 没有则往网站信息表里插入数据
      const webInfo = plainToInstance(InfoEntity, updateInfoDto, { ignoreDecorators: true })
      const result = await this.infoManager.transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<InfoEntity>(webInfo)
      })
      return ResultData.ok(instanceToPlain(result));
    } else {
      // 有则更新网站信息表
      const webInfo = plainToInstance(InfoEntity, updateInfoDto, { ignoreDecorators: true })
      webInfo.id = '1';
      const result = await this.infoManager.transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<InfoEntity>(webInfo);
      })

      if (ip.indexOf('::ffff:') !== -1) {
        ip = ip.substring(7)
      }
      this.operalogService.create({
        systemMenu: '网站信息',
        operaModule: `更新网站信息`,
        operaName: account,
        operaIp: ip,
        status: 1
      })
      return ResultData.ok(instanceToPlain(result));
    }
  }

}

import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResultData } from '../../common/utils/result';

import { OperalogEntity } from './entities/operalog.entity'

import { FindOperaListDto } from './dto/find-operalog-list.dto'

@Injectable()
export class OperalogService {
  constructor(
    @InjectRepository(OperalogEntity)
    private readonly operalogRepo: Repository<OperalogEntity>,
    @InjectEntityManager()
    private readonly operalogManager: EntityManager,
  ) {}

  async create(data): Promise<ResultData> {
    const operalog = plainToInstance(OperalogEntity, data, { ignoreDecorators: true })
    const result = await this.operalogManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<OperalogEntity>(operalog)
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询操作日志分页查询 */
  async findList(dto: FindOperaListDto) {
    const { page, size, status, operaIp, operaName } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(operaName ? { operaName: Like(`%${operaName}%`) } : null),
      ...(operaIp ? { operaIp: Like(`%${operaIp}%`) } : null)
    }
    const partner = await this.operalogRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(partner[0]), total: partner[1] })
  }

}

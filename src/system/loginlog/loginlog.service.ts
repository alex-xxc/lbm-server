import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResultData } from '../../common/utils/result';

import { LoginlogEntity } from './entities/loginlog.entity'

import { FindLoginListDto } from './dto/find-loginlog-list.dto'

@Injectable()
export class LoginlogService {
  constructor(
    @InjectRepository(LoginlogEntity)
    private readonly loginlogRepo: Repository<LoginlogEntity>,
    @InjectEntityManager()
    private readonly loginlogManager: EntityManager,
  ) {}
  
  /** 创建登录日志 */
  async create(data): Promise<ResultData> {
    const loginlog = plainToInstance(LoginlogEntity, data, { ignoreDecorators: true })
    const result = await this.loginlogManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<LoginlogEntity>(loginlog)
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询登录日志分页查询 */
  async findList(dto: FindLoginListDto) {
    const { page, size, status, userName } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(userName ? { userName: Like(`%${userName}%`) } : null)
    }
    const partner = await this.loginlogRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(partner[0]), total: partner[1] })
  }

}

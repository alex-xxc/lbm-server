import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { genSalt, hash, compare, genSaltSync, hashSync } from 'bcryptjs';

import { AccessEntity } from './entities/access.entity';

import { ResultData } from '../../common/utils/result';
import { AppHttpCode } from '../../common/enums/code.enum';

import { CreateAccessDto } from './dto/create-access.dto';
import { FindAccessListDto } from './dto/find-access-list.dto';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessEntity)
    private readonly accessRepo: Repository<AccessEntity>,
    @InjectEntityManager()
    private readonly accessManager: EntityManager,
  ) {}

  /** 添加访问记录*/
  async create(createMessageDto: CreateAccessDto) {
    const access = plainToInstance(AccessEntity, createMessageDto, { ignoreDecorators: true })
    const result = await this.accessManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<AccessEntity>(access)
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询访问记录分页查询 */
  async findList(dto: FindAccessListDto) {
    const { page, size, district } = dto;
    const where = {
      ...(district ? { district: Like(`%${district}%`) } : null)
    }
    const access = await this.accessRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(access[0]), total: access[1] })
  }

  async findOneById(id: string): Promise<AccessEntity> {
    let access = await this.accessRepo.findOne({ where: { id } })
    access = plainToInstance(AccessEntity, { ...access }, { enableImplicitConversion: true })
    return access
  }

  /** 查询单条访问 */
  async findOne(id: string) {
    const access = await this.findOneById(id)
    if (!access) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该访问不存在或已删除')
    return ResultData.ok(instanceToPlain(access))
  }
}

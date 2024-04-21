import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, DataSource, EntityManager } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import { ResultData } from '../common/utils/result'

import { ContentTagsEntity } from './entities/content-tags.entity'
import { CreateOrUpdateContentTagsDto } from './dto/create-content-tag.dto'

@Injectable()
export class ContentTagsService {
  constructor(
    @InjectRepository(ContentTagsEntity)
    private readonly contentTagsEntity: Repository<ContentTagsEntity>,
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly manager: EntityManager
    
  ){}
  
  /** 创建 or 更新内容-标签 */
  async createOrUpdateContentTags(dto: CreateOrUpdateContentTagsDto) {
    const contentTagsList = plainToInstance(
      ContentTagsEntity,
      dto.tagsIds.map((tagsId) => {
        return { tagsId, contentId: dto.contentId }
      }),
    )

    const res = await this.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(ContentTagsEntity, { contentId: dto.contentId })
      const result = await transactionalEntityManager.save<ContentTagsEntity>(contentTagsList)
      return result
    })
    if (!res) return false;
    return true
  }

  /** 删除-标签 */
  async deleteTags(tagsId) {
    const res = await this.manager.transaction(async (transactionalEntityManager) => {
      const result = await transactionalEntityManager.delete(ContentTagsEntity, { tagsId: tagsId })
      return result
    })
    if (!res) return false;
    return true
  }

  /** 根据内容id 查询标签 id 集合 */
  async findContentTagsByContentId(id: string): Promise<string[]> {
    const tags = await this.contentTagsEntity.find({ select: ['tagsId'], where: { contentId: id } })
    const tagsIds = tags.map((v) => v.tagsId)
    return tagsIds
  }

  /**
   * @param tagsId 标签 id
   * @param isCorrelation 是否相关联， true 查询拥有当前 标签的内容， false 查询无当前标签的内容
   * 没有逻辑删除的即可返回
   */
  async findContentByTagsId(tagsId: Array<string>, page: number, size: number): Promise<ResultData> {
    let res = await this.dataSource
        .createQueryBuilder('content', 'su')
        .leftJoinAndSelect('content_tags', 'ur', 'ur.content_id = su.id')
        .where(`ur.tags_id in(${tagsId})`)
        .andWhere('su.isDelete != 0 and su.status = 1')
        .skip(size * (page - 1))
        .take(size)
        .getManyAndCount()
    return ResultData.ok({ list: instanceToPlain(res[0]), total: res[1] })
  }
}

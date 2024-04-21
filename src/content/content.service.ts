import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In, EntityManager, Between } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import { ResultData } from '../common/utils/result';
import { AppHttpCode } from '../common/enums/code.enum';

import { CreateContentDto } from './dto/create-content.dto'
import { CreateTagsDto } from './dto/create-content-tags.dto'
import { CreateColumnDto } from './dto/create-content-column.dto'

import { FindContentListDto } from './dto/find-content-list.dto'
import { FindColumnListDto } from './dto/find-column-list.dto'
import { FindTagsListDto } from './dto/find-tags-list.dto'

import { UpdateContentDto } from './dto/update-content.dto'
import { UpdateColumnDto } from './dto/update-column.dto'
import { UpdateTagsDto } from './dto/update-tags.dto'


import { ContentEntity } from './entities/content.entity'
import { TagsEntity } from './entities/tags.entity'
import { ColumnEntity } from './entities/column.entity'

import { OperalogService } from 'src/system/operalog/operalog.service'

import { ContentTagsService } from './content-tags.service'

import config from '../config/index'

import { dateSqlQuery } from '../common/utils/utils'

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepo: Repository<ContentEntity>,
    @InjectRepository(TagsEntity)
    private readonly tagsRepo: Repository<TagsEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepo: Repository<ColumnEntity>,
    @InjectEntityManager()
    private readonly manager: EntityManager,
    private readonly operalogService: OperalogService,
    private readonly contentTagsService: ContentTagsService
  ){}
  
  /** 查询内容单条数据 */
  async findOneById(id: string): Promise<ContentEntity> {
    let info = await this.contentRepo.findOne({ 
      where: { id }
    })
    // info = plainToInstance(ContentEntity, { ...info }, { enableImplicitConversion: true })
    return info
  }

  /** 查询栏目单条数据 */
  async findOneColumnById(id: string): Promise<ColumnEntity> {
    let info = await this.columnRepo.findOne({ where: { id } })
    info = plainToInstance(ColumnEntity, { ...info }, { enableImplicitConversion: true })
    return info
  }

  /** 查询标签单条数据 */
  async findOneTagsById(id: string): Promise<TagsEntity> {
    let info = await this.tagsRepo.findOne({ where: { id } })
    info = plainToInstance(TagsEntity, { ...info }, { enableImplicitConversion: true })
    return info
  }

  /** 
   * 内容区start
   */

  /** 创建内容 */
  async createContent(createContentDto: CreateContentDto, account: String, ip: String) {
    /** 创建内容 */
    const existing = plainToInstance(ContentEntity, { ...createContentDto }, { ignoreDecorators: true })
    existing.content = existing.content.replace(new RegExp(`${config().app.file.domain}`, 'g'), '')
    const result = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<ContentEntity>(existing)
    })

    const tagsIds = createContentDto.tags || [];

    if (tagsIds.length > 0) {
      await this.contentTagsService.createOrUpdateContentTags({ contentId: result.id, tagsIds })
    }

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    /** 成功后添加操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '内容管理',
      operaModule: `添加内容 -【${createContentDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询内容分页查询 */
  async findContentList(dto: FindContentListDto) {
    const { page, size, tagsId, status, title, startDate, endDate } = dto;

    if (tagsId) {
      const tagsIdArray = JSON.parse(JSON.stringify(tagsId)).split(',')
      const result = await this.contentTagsService.findContentByTagsId(tagsIdArray, page, size)
      return result
    }

    let createDate;
    if (startDate && endDate) {
      const endDateData = dateSqlQuery(endDate)
      createDate = Between(new Date(startDate), new Date(endDateData))
    } else {
      createDate = null
    }

    const where = {
      ...(status ? { status } : null),
      ...(title ? { title: Like(`%${title}%`) } : null), 
      createDate,
      isDelete: 1
    }
    const queryData = await this.contentRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })

    // 获取推荐返回推荐文本给前端
    const returnDataList = JSON.parse(JSON.stringify(instanceToPlain(queryData[0])))
    const recomAllList = [
      {
        value: 'recom',
        label: '推荐'
      },
      {
        value: 'frontPage',
        label: '头条'
      }
    ]

    // 获取推荐返回推荐文本给前端
    returnDataList.forEach(async (item) => {
      const recomList = item.recom.split(',')
      item.recomText = recomAllList.filter(rAi => recomList.some(rI => rAi.value === rI)).map(mI => mI.label).join(',')
      
    })

    return ResultData.ok({ list: returnDataList, total: queryData[1] })
  }

  /** 查询内容单条信息 */
  async findContentOne(id: string) {
    const queryData = await this.findOneById(id)
    if (!queryData) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该内容不存在或已删除')
    queryData.content = queryData.content.replace(new RegExp('/static/', 'g'), `${config().app.file.domain}/static/`)
    const tagsIds = await this.contentTagsService.findContentTagsByContentId(id);
    const returnData = JSON.parse(JSON.stringify(instanceToPlain(queryData)))
    returnData.tags = tagsIds
    return ResultData.ok(returnData)
  }

  /** 更新内容 */
  async updateContent(updateContentDto: UpdateContentDto, account: String, ip: String) {

    /** 查询内容是否存在 */
    const existing = await this.findOneById(updateContentDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该内容不存在或已删除');
    
    const queryData = instanceToPlain(updateContentDto)
    if (queryData.content !== '') {
      queryData.content = queryData.content.replace(new RegExp(`${config().app.file.domain}`, 'g'), '')
    }
    const tagsIds = queryData.tags || [];
    delete queryData.tags

    const { affected } = await this.manager.transaction(async (transactionalEntityManager) => {
      await this.contentTagsService.createOrUpdateContentTags({ contentId: updateContentDto.id, tagsIds })
      return await transactionalEntityManager.update<ContentEntity>(ContentEntity, updateContentDto.id, queryData)
      // return await transactionalEntityManager.save(ContentEntity, queryData)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新内容成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '内容管理',
      operaModule: `更新内容 -【${updateContentDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok();
  }

  
  /** 更新内容状态 */
  async updateContentStatus(contentId: string, status: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询内容是否存在 */
    const existing = await this.findOneById(contentId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前内容不存在或已删除')

    /** 更新content状态 */
    const { affected } = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<ContentEntity>(ContentEntity, contentId, { id: contentId, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');
    /** 更新content状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '内容',
      operaModule: `更新内容状态 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 逻辑删除内容 */
  async updateContentDelete(contentId: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询内容是否存在 */
    const existing = await this.findOneById(contentId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前内容不存在或已删除')
    /** 逻辑删除内容 */
    const ids = contentId.split(',');
    const { affected } = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update(ContentEntity, { id: In(ids) }, { isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');
    /** 逻辑删除内容状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '内容',
      operaModule: `删除内容 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 
   * 内容区end -----------------------------
   */


  /** 
   * 栏目区start
   */

  /** 创建栏目 */
  async createColumn(createColumnDto: CreateColumnDto, account: String, ip: String) {
    /** 创建栏目 */
    const existing = plainToInstance(ColumnEntity, { ...createColumnDto }, { ignoreDecorators: true })
    existing.content = existing.content.replace(new RegExp(`${config().app.file.domain}`, 'g'), '')
    const result = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<ColumnEntity>(existing)
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    /** 成功后添加操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '栏目管理',
      operaModule: `添加栏目 -【${createColumnDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询栏目分页查询 */
  async findColumnList(dto: FindColumnListDto) {
    const { type, title } = dto;
    const where = {
      ...(type ? { type } : null),
      ...(title ? { title: Like(`%${title}%`) } : null),
      isDelete: 1
    }
    const queryData = await this.columnRepo.findAndCount({
      where,
      order: { id: 'DESC' },
    })
    return ResultData.ok({ list: instanceToPlain(queryData[0]), total: queryData[1] })
  }

  /** 查询栏目所有 */
  async findColumnAllList() {
    const where = {
      isDelete: 1
    }
    const queryData = await this.columnRepo.findAndCount({
      where,
      order: { id: 'DESC' }
    })
    return ResultData.ok(instanceToPlain(queryData[0]))
  }

  /** 查询栏目单条信息 */
  async findColumnOne(id: string) {
    const queryData = await this.findOneColumnById(id)
    if (!queryData) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该栏目不存在或已删除')
    queryData.content = queryData.content.replace(new RegExp('/static/', 'g'), `${config().app.file.domain}/static/`)
    return ResultData.ok(queryData)
  }

  /** 更新栏目 */
  async updateColumn(updateColumnDto: UpdateColumnDto, account: String, ip: String) {
    /** 查询栏目是否存在 */
    const existing = await this.findOneColumnById(updateColumnDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该栏目不存在或已删除');
    /** 更新栏目 */
    const queryData = instanceToPlain(updateColumnDto)
    if (queryData.content !== '') {
      queryData.content = queryData.content.replace(new RegExp(`${config().app.file.domain}`, 'g'), '')
    }
    const { affected } = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<ColumnEntity>(ColumnEntity, updateColumnDto.id, queryData)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新栏目成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '栏目管理',
      operaModule: `更新栏目 -【${updateColumnDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok();
  }

  /** 逻辑删除栏目 */
  async updateColumnDelete(columnId: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询栏目是否存在 */
    const existing = await this.findOneColumnById(columnId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前内容不存在或已删除')
    /** 逻辑删除栏目 */
    const { affected } = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<ColumnEntity>(ColumnEntity, columnId, { id: columnId, isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');
    /** 逻辑删除栏目状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '栏目',
      operaModule: `删除栏目 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 
   * 栏目区end ----------------------------
   */


  /** 
   * 标签区start
   */

  /** 创建标签 */
  async createTags(createTagsDto: CreateTagsDto, account: String, ip: String) {
    /** 创建标签 */
    const existing = plainToInstance(TagsEntity, { ...createTagsDto }, { ignoreDecorators: true })
    const result = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<TagsEntity>(existing)
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    /** 成功后添加操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '标签管理',
      operaModule: `添加标签 -【${createTagsDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 创建AI标签 */
  async createAiTags(data: Array<object>, account: String, ip: String) {
    /** 创建标签 */
    const result = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<TagsEntity>(
        plainToInstance(TagsEntity, data, { ignoreDecorators: true }),
      )
    })

    if (!result) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    /** 成功后添加操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '标签管理',
      operaModule: `AI生成标签`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok(instanceToPlain(result));
  }

  /** 查询标签分页查询 */
  async findTagsList(dto: FindTagsListDto) {
    const { page, size, status, title } = dto;
    const where = {
      ...(status ? { status } : null),
      ...(title ? { title: Like(`%${title}%`) } : null),
      isDelete: 1
    }
    const queryData = await this.tagsRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: size * (page - 1),
      take: size,
    })
    return ResultData.ok({ list: instanceToPlain(queryData[0]), total: queryData[1] })
  }

  /** 查询标签所有 */
  async findTagsAllList() {
    const where = {
      isDelete: 1
    }
    const queryData = await this.tagsRepo.findAndCount({
      where,
      order: { id: 'DESC' }
    })
    return ResultData.ok(instanceToPlain(queryData[0]))
  }

  /** 查询标签单条信息 */
  async findTagsOne(id: string) {
    const queryData = await this.findOneTagsById(id)
    if (!queryData) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该标签不存在或已删除')
    return ResultData.ok(instanceToPlain(queryData))
  }

  /** 更新标签 */
  async updateTags(updateTagsDto: UpdateTagsDto, account: String, ip: String) {
    /** 查询标签是否存在 */
    const existing = await this.findOneTagsById(updateTagsDto.id)
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该标签不存在或已删除');
    /** 更新标签 */
    const queryData = instanceToPlain(updateTagsDto)
    const { affected } = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<TagsEntity>(TagsEntity, updateTagsDto.id, queryData)
    })

    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
    /** 更新标签成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '标签管理',
      operaModule: `更新标签 -【${updateTagsDto.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok();
  }

  
  /** 更新标签状态 */
  async updateTagsStatus(tagsId: string, status: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询标签是否存在 */
    const existing = await this.findOneTagsById(tagsId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前内容不存在或已删除')

    /** 更新标签状态 */
    const { affected } = await this.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<TagsEntity>(TagsEntity, tagsId, { id: tagsId, status })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');
    /** 更新标签状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '标签',
      operaModule: `更新标签状态 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 逻辑删除标签 */
  async updateTagsDelete(tagsId: string, isDelete: 0 | 1, account: String, ip: String): Promise<ResultData> {
    /** 查询标签是否存在 */
    const existing = await this.findOneTagsById(tagsId)
    if (!existing) ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前标签不存在或已删除')
    /** 逻辑删除标签 */
    const ids = tagsId.split(',');
    const { affected } = await this.manager.transaction(async (transactionalEntityManager) => {
      await this.contentTagsService.deleteTags(tagsId)
      return await transactionalEntityManager.update(TagsEntity, { id: In(ids) }, { isDelete })
    })
    if (!affected) ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后尝试');
    /** 逻辑删除标签状态成功后插入操作日志 */
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7)
    }
    this.operalogService.create({
      systemMenu: '标签',
      operaModule: `删除标签 -【${existing.title}】`,
      operaName: account,
      operaIp: ip,
      status: 1
    })
    return ResultData.ok()
  }

  /** 
   * 标签区end -----------------------------
   */
  
}

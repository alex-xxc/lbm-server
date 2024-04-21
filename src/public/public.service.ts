import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Like, Repository, In, EntityManager, DataSource } from 'typeorm'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { genSalt, hash, compare, genSaltSync, hashSync } from 'bcryptjs'

import { UserEntity } from '../client/clientuser/entities/clientuser.entity'
import { MessageEntity } from '../message/entities/message.entity'
import { AccessEntity } from '../client/access/entities/access.entity'
import { ContentEntity } from '../content/entities/content.entity'

import { formerlyMonth } from '../common/utils/utils'

import { ResultData } from '../common/utils/result'
import { sseEvent } from 'src/common/sseEvent/utils';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepo: Repository<AccessEntity>,
    @InjectRepository(ContentEntity)
    private readonly contentRepo: Repository<ContentEntity>,
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}
  
  /** 查询客户端用户列表 */
  async findClientUserList(): Promise<ResultData> {
    const users = await this.userRepo.findAndCount({
      order: { id: 'DESC' }
    })
    return ResultData.ok({ list: instanceToPlain(users[0]), total: users[1] })
  }

  /** 查询未读留言列表 */
  async findMessageList(): Promise<ResultData> {
    const isNoReadData = await this.messageRepo.findAndCount({
      where: {
        status: 0
      },
      order: { id: 'DESC' }
    })

    const isReadData = await this.messageRepo.findAndCount({
      where: {
        status: 1
      },
      order: { id: 'DESC' }
    })

    const allNumber = isNoReadData[1] + isReadData[1]
    const messageData = { isNoReadNumber: isNoReadData[1], isReadNumber: isReadData[1], allNumber: allNumber }
    sseEvent.getEvent().emit('send', messageData);
    return ResultData.ok(messageData)
  }

  /** 获取过去12个月的访问数据 */
  async getFormerlyMonth() {
    const formerlyMonthData = formerlyMonth(11);
    const query = `SELECT DATE_FORMAT(create_date, '%Y年%m月') AS month, COUNT(*) as total_count FROM client_access WHERE create_date >= CURRENT_DATE() - INTERVAL 12 MONTH GROUP BY month`;
    const queryData = await this.accessRepo.query(query);
    const adjustData = formerlyMonthData.map(item => {
      const isMonthData = queryData.find(yItem => yItem.month === item);
      if (!isMonthData) {
        return {
          month: item,
          total_count: 0
        }
      } else {
        return {
          month: isMonthData.month,
          total_count: parseInt(isMonthData.total_count)
        }
      }
    })
    const yearMonth = adjustData.map(item => {
      if (item) {
        return item.month
      }
    })

    const dataCount = adjustData.map(item => {
      if (item) {
        return item.total_count
      }
    })
    const returnData = {
      dataCount,
      yearMonth
    }
    return ResultData.ok(returnData)
  }

  /** 获取内容访问量、收藏量、咨询量 */
  async getContentAccess() {
    // 内容收藏量、咨询量
    const where = {
      status: 1,
      isDelete: 1
    }
    const queryData = await this.contentRepo.findAndCount({
      where,
      order: { id: 'DESC' }
    })

    // 内容访问量
    const access = await this.accessRepo.findAndCount({
      where: {
        isContent: 1
      },
      order: { id: 'DESC' }
    })

    // 相加
    const returnDataList = JSON.parse(JSON.stringify(queryData[0]));
    const consultNum = returnDataList.reduce((sumData, key, index, arrData)=>{
      return sumData + key.consultNum
    }, 0)

    const collectNum = returnDataList.reduce((sumData, key, index, arrData)=>{
      return sumData + key.collectNum
    }, 0)

    const returnData = {
      consultNum,
      collectNum,
      accessNum: access[1]
    }

    return ResultData.ok(returnData);
  }
}

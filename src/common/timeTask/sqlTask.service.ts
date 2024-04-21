import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import mysqldump from 'mysqldump';
import configuration from '../../config/index'

@Injectable()
export class SqlTaskService {
  // 每天凌晨一点备份数据库，CronExpression.EVERY_DAY_AT_1AM
  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'sqlTask',
    timeZone: 'Asia/shanghai'
  })
  handleCron() {
    const sqlInfo = configuration().db.mysql
    mysqldump({
      connection: {
          host: sqlInfo.host,
          user: sqlInfo.username,
          password: sqlInfo.password,
          database: sqlInfo.database
      },
      dumpToFile: `./backSql/${Math.round(Date.now() / 1000)}.sql`,
    });
    console.log('备份数据库');
  }
}

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisClientOptions } from '@liaoliaots/nestjs-redis'
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static'
import { APP_GUARD } from '@nestjs/core'
import path from 'path'
import { ScheduleModule } from '@nestjs/schedule';

import configuration from './config/index'

import { SqlTaskService } from './common/timeTask/sqlTask.service'
import { WsAiService } from './common/ws/ws.service'
import { WsStartGateway } from './common/ws/ws.gateway'
import { WsModule } from './common/ws/ws.module'

import { RedisModule } from './common/libs/redis/redis.module'
import { JwtAuthGuard } from './common/guards/auth.guard'
import { EmailModule } from './common/email/email.module'
import { SmsModule } from './common/sms/sms.module'
import { LogisticsModule } from './common/logistics/logistics.module'

import { UserModule } from './system/user/user.module'
import { AuthModule } from './system/auth/auth.module'
import { MenuModule } from './system/menu/menu.module'
import { PermModule } from './system/perm/perm.module'
import { DictModule } from './system/dict/dict.module'
import { OssModule } from './system/oss/oss.module'
import { OperalogModule } from './system/operalog/operalog.module'
import { LoginlogModule } from './system/loginlog/loginlog.module'
import { HomeModule } from './home/home.module'
import { PartnerModule } from './partner/partner.module'
import { InfoModule } from './system/info/info.module'
import { MessageModule } from './message/message.module'
import { SettingModule } from './system/setting/setting.module'
import { ContentModule } from './content/content.module'
import { ClientuserModule } from './client/clientuser/clientuser.module'
import { AccessModule } from './client/access/access.module'
import { PublicModule } from './public/public.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    // 服务静态化, 生产环境最好使用 nginx 做资源映射， 可以根据环境配置做区分
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const fileUploadLocationConfig = config.get<string>('app.file.location') || '../upload'
        const rootPath = path.isAbsolute(fileUploadLocationConfig)
          ? `${fileUploadLocationConfig}`
          : path.join(process.cwd(), `${fileUploadLocationConfig}`)
        return [
          {
            rootPath,
            exclude: [`${config.get('app.prefix')}`],
            serveRoot: config.get('app.file.serveRoot'),
            serveStaticOptions: {
              cacheControl: true,
            },
          },
        ] as ServeStaticModuleOptions[]
      },
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          // 可能不再支持这种方式，entities 将改成接收 实体类的引用
          //
          // entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          autoLoadEntities: true,
          keepConnectionAlive: true,
          ...config.get('db.mysql'),
          // cache: {
          //   type: 'ioredis',
          //   ...config.get('redis'),
          //   alwaysEnabled: true,
          //   duration: 3 * 1000, // 缓存3s
          // },
        } as TypeOrmModuleOptions
      },
    }),
    // libs redis
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          return {
            closeClient: true,
            readyLog: true,
            errorLog: true,
            config: config.get<RedisClientOptions>('redis'),
          }
        },
      },
      true,
    ),
    // 定时任务
    ScheduleModule.forRoot(),
    // 邮箱
    EmailModule,
    // 短信
    SmsModule,
    // websocket
    WsModule,
    // 物流
    LogisticsModule,
    // 系统基础模块
    UserModule,
    AuthModule,
    MenuModule,
    PermModule,
    OssModule,
    OperalogModule,
    LoginlogModule,
    DictModule,
    // 业务功能模块
    HomeModule,
    PartnerModule,
    InfoModule,
    MessageModule,
    SettingModule,
    ContentModule,
    ClientuserModule,
    AccessModule,
    PublicModule,
  ],
  // app module 守卫，两个守卫分别依赖 UserService、PermService, 而 UserService、PermService 没有设置全局模块，
  // 所以这俩 守卫 不能再 main.ts 设置全局守卫
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    SqlTaskService,
    WsAiService,
    WsStartGateway
  ],
})
export class AppModule {}

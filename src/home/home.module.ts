import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// 轮播图
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { BannerEntity } from './entities/banner.entity';

// 首页内容
import { HomeContentService } from './home-content.service';
import { HomeContentController } from './home-content.controller';
import { HomeContentEntity } from './entities/home-content.entity';

// 首页内容关联列表
import { HomeContentListService } from './home-content-list.service';
import { HomeContentListController } from './home-content-list.controller';
import { HomeContentListEntity } from './entities/home-content-list.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity, HomeContentEntity, HomeContentListEntity])],
  controllers: [BannerController, HomeContentController, HomeContentListController],
  providers: [BannerService, HomeContentService, HomeContentListService],
})
export class HomeModule {}

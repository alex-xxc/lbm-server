import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginlogService } from './loginlog.service'
import { LoginlogController } from './loginlog.controller'
import { LoginlogEntity } from './entities/loginlog.entity'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoginlogEntity])],
  controllers: [LoginlogController],
  providers: [LoginlogService],
  exports: [LoginlogService]
})
export class LoginlogModule {}

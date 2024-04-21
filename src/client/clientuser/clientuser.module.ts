import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientUserService } from './clientuser.service';
import { ClientUserController } from './clientuser.controller';
import { UserEntity } from './entities/clientuser.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [ClientUserController],
  providers: [ClientUserService],
})
export class ClientuserModule {}

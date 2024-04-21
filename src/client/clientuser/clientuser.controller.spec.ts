import { Test, TestingModule } from '@nestjs/testing';
import { ClientuserController } from './clientuser.controller';
import { ClientuserService } from './clientuser.service';

describe('ClientuserController', () => {
  let controller: ClientuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientuserController],
      providers: [ClientuserService],
    }).compile();

    controller = module.get<ClientuserController>(ClientuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

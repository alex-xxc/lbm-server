import { Test, TestingModule } from '@nestjs/testing';
import { LoginlogController } from './loginlog.controller';
import { LoginlogService } from './loginlog.service';

describe('LoginlogController', () => {
  let controller: LoginlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginlogController],
      providers: [LoginlogService],
    }).compile();

    controller = module.get<LoginlogController>(LoginlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { OperalogController } from './operalog.controller';
import { OperalogService } from './operalog.service';

describe('OperalogController', () => {
  let controller: OperalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperalogController],
      providers: [OperalogService],
    }).compile();

    controller = module.get<OperalogController>(OperalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

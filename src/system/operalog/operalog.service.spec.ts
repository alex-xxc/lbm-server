import { Test, TestingModule } from '@nestjs/testing';
import { OperalogService } from './operalog.service';

describe('OperalogService', () => {
  let service: OperalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperalogService],
    }).compile();

    service = module.get<OperalogService>(OperalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

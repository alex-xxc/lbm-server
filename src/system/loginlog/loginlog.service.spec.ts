import { Test, TestingModule } from '@nestjs/testing';
import { LoginlogService } from './loginlog.service';

describe('LoginlogService', () => {
  let service: LoginlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginlogService],
    }).compile();

    service = module.get<LoginlogService>(LoginlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

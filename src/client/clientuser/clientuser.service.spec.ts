import { Test, TestingModule } from '@nestjs/testing';
import { ClientUserService } from './clientuser.service';

describe('ClientuserService', () => {
  let service: ClientuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientUserService],
    }).compile();

    service = module.get<ClientUserService>(ClientUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

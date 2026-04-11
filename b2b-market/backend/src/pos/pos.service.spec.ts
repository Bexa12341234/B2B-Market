import { Test, TestingModule } from '@nestjs/testing';
import { POSService } from './pos.service';

describe('POSService', () => {
  let service: POSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [POSService],
    }).compile();

    service = module.get<POSService>(POSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

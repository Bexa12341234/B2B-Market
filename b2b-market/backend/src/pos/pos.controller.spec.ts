import { Test, TestingModule } from '@nestjs/testing';
import { POSController } from './pos.controller';

describe('POSController', () => {
  let controller: POSController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [POSController],
    }).compile();

    controller = module.get<POSController>(POSController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

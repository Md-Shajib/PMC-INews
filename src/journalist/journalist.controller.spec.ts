import { Test, TestingModule } from '@nestjs/testing';
import { JournalistController } from './journalist.controller';
import { JournalistService } from './journalist.service';

describe('JournalistController', () => {
  let controller: JournalistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalistController],
      providers: [JournalistService],
    }).compile();

    controller = module.get<JournalistController>(JournalistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

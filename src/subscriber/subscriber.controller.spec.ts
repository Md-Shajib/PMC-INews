import { Test, TestingModule } from '@nestjs/testing';
import { SubscriberController } from './subscriber.controller';
import { SubscriberService } from './subscriber.service';

describe('SubscriberController', () => {
  let controller: SubscriberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriberController],
      providers: [SubscriberService],
    }).compile();

    controller = module.get<SubscriberController>(SubscriberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

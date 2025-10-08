import { Test, TestingModule } from '@nestjs/testing';
import { JournalistService } from './journalist.service';

describe('JournalistService', () => {
  let service: JournalistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JournalistService],
    }).compile();

    service = module.get<JournalistService>(JournalistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NewsPostService } from './news-post.service';

describe('NewsPostService', () => {
  let service: NewsPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsPostService],
    }).compile();

    service = module.get<NewsPostService>(NewsPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NewsPostController } from './news-post.controller';
import { NewsPostService } from './news-post.service';

describe('NewsPostController', () => {
  let controller: NewsPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsPostController],
      providers: [NewsPostService],
    }).compile();

    controller = module.get<NewsPostController>(NewsPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

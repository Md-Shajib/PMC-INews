import { Module } from '@nestjs/common';
import { NewsPostService } from './news-post.service';
import { NewsPostController } from './news-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsPost } from './entities/news-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsPost])
  ],
  controllers: [NewsPostController],
  providers: [NewsPostService],
})
export class NewsPostModule {}

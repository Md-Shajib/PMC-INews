import { Module } from '@nestjs/common';
import { NewsPostService } from './news-post.service';
import { NewsPostController } from './news-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsPost } from './entities/news-post.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsPost]),
  ],
  controllers: [NewsPostController],
  providers: [NewsPostService, JwtService],
})
export class NewsPostModule {}

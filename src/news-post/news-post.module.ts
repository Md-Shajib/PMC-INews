import { Module } from '@nestjs/common';
import { NewsPostService } from './news-post.service';
import { NewsPostController } from './news-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsPost } from './entities/news-post.entity';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [ TypeOrmModule.forFeature([NewsPost])],
  controllers: [NewsPostController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    NewsPostService,
    JwtService
  ],
})
export class NewsPostModule {}

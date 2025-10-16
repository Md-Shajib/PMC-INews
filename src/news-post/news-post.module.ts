import { Module } from '@nestjs/common';
import { NewsPostService } from './news-post.service';
import { NewsPostController } from './news-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsPost } from './entities/news-post.entity';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { JournalistController } from 'src/journalist/journalist.controller';
import { JournalistService } from 'src/journalist/journalist.service';
import { Journalist } from 'src/journalist/entities/journalist.entity';
import { User } from 'src/users/entities/user.entity';
import { ViewLog } from './entities/view-logs.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([NewsPost, Journalist, User, ViewLog])],
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

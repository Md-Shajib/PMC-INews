import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { NewsPostModule } from './news-post/news-post.module';
import { CommentModule } from './comment/comment.module';
import { ReactModule } from './react/react.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { JournalistModule } from './journalist/journalist.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity{.ts,.js}')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    NewsPostModule,
    CommentModule,
    ReactModule,
    CategoryModule,
    AuthModule,
    JournalistModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

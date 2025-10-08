import { Module } from '@nestjs/common';
import { JournalistService } from './journalist.service';
import { JournalistController } from './journalist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journalist } from './entities/journalist.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journalist]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '72h' },
    }),
    UsersModule,
  ],
  controllers: [JournalistController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JournalistService
  ],
})
export class JournalistModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '30d'}
    })
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersService
  ],
  exports: [UsersService],
})
export class UsersModule {}

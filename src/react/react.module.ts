import { Module } from '@nestjs/common';
import { ReactService } from './react.service';
import { ReactController } from './react.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { React } from './entities/react.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([React]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    })
  ],
  controllers: [ReactController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ReactService
  ],
})
export class ReactModule {}




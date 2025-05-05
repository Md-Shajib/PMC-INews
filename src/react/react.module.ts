import { Module } from '@nestjs/common';
import { ReactService } from './react.service';
import { ReactController } from './react.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { React } from './entities/react.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([React])
  ],
  controllers: [ReactController],
  providers: [ReactService],
})
export class ReactModule {}




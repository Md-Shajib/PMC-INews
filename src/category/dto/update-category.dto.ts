import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryStatus } from '../entities/category.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsEnum(CategoryStatus, { message: 'Status must be either active or disabled' })
  @IsOptional()
  status?: CategoryStatus;
}

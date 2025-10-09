import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FaqStatus } from '../entities/faq.entity';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(FaqStatus, {
    message: 'status must be a valid enum value, like "active" or "disabled"',
  })
  status?: FaqStatus;
}

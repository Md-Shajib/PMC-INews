
import { IsNotEmpty, IsUUID, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  news_id: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsNumber()
  @Min(0.5)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsOptional()
  @IsNotEmpty()
  review?: string;
}

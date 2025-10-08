
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { JournalistStatus } from '../entities/journalist.entity';

export class CreateJournalistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsEnum(JournalistStatus)
  @IsOptional()
  status?: JournalistStatus; // defaults to 'active' if not provided

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  @IsOptional()
  birthday?: string;

  @IsUrl()
  @IsOptional()
  facebook?: string;

  @IsUrl()
  @IsOptional()
  twitter?: string;

  @IsUrl()
  @IsOptional()
  linkedin?: string;
}

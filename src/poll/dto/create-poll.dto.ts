// create-poll.dto.ts
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PollOptionStatus } from '../entities/poll-option.entity';

export enum PollStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export class PollOptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Option text must be less than 255 characters' })
  option_text: string;
}

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Title must be less than 500 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must be less than 500 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(PollStatus, { message: 'Invalid poll status' })
  status?: PollStatus = PollStatus.ACTIVE;

  @IsOptional()
  @IsDateString({ strict: true }, { message: 'Invalid start date' })
  start_date?: Date;

  @IsOptional()
  @IsDateString({ strict: true }, { message: 'Invalid end date' })
  end_date?: Date;

  @IsArray()
  @ArrayMinSize(2, { message: 'At least two options are required' })
  @ValidateNested({ each: true })
  @Type(() => PollOptionDto)
  options: PollOptionDto[];
}

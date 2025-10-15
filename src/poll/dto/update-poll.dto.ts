import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { PollOptionStatus } from "../entities/poll-option.entity";
import { Type } from "class-transformer";
import { PollStatus } from "./create-poll.dto";

export class UpdatePollOptionDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  option_text: string;

  @IsOptional()
  @IsEnum(PollOptionStatus)
  status?: PollOptionStatus;
}

export class UpdatePollDto {
  @IsOptional()
  @IsString()
  title?: string; // renamed from question

  @IsOptional()
  @IsString()
  description?: string; // renamed from title

  @IsOptional()
  @IsEnum(PollStatus)
  status?: PollStatus;

  @IsOptional()
  start_date?: Date;

  @IsOptional()
  end_date?: Date;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePollOptionDto)
  options?: UpdatePollOptionDto[];
}

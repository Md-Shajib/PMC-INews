import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength
} from 'class-validator';
import { CommentStatus, CommentType } from '../entities/comment.entity';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  news_id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(800, { message: 'The maximum character of comment is 800' })
  comment: string;

  @IsOptional()
  @IsEnum({ CommentType, default: CommentType.COMMENT })
  type?: CommentType;

  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus = CommentStatus.ACTIVE;
}

export class CreateReplayDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  news_id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(800, { message: 'The maximum character of comment is 800' })
  comment: string;

  @IsNotEmpty()
  @IsUUID()
  parent_id: string;

  @IsOptional()
  @IsEnum({ CommentType, default: CommentType.REPLAY })
  type?: CommentType;
}

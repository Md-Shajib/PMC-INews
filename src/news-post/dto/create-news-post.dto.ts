
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export enum NewsStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    // UNPUBLISHED = 'unpublished',
    BANNED = 'banned',
}

export enum NewsType {
    IMAGE = 'image',
    VIDEO = 'video'
}


export class CreateNewsPostDto {
  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsUUID()
  @IsNotEmpty()
  journalist_id: string;

  @IsEnum(NewsType)
  @IsNotEmpty()
  news_type: NewsType;

  @IsString()
  @IsNotEmpty()
  news_title: string;

  @IsString()
  @IsNotEmpty()
  news_body: string;

  @IsString()
  @IsOptional()
  media_link?: string;

  @IsEnum(NewsStatus)
  @IsOptional()
  status?: NewsStatus;

  // created_at & updated_at are automatically handled by TypeORM
}

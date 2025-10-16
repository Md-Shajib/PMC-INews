import { PartialType } from '@nestjs/swagger';
import { CreateNewsPostDto, CreateViewLogDto } from './create-news-post.dto';

export class UpdateNewsPostDto extends PartialType(CreateNewsPostDto) {}

export class UpdateViewLogDto extends PartialType(CreateViewLogDto) {}

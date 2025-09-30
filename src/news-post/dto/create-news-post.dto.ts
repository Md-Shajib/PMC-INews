import { IsDateString, IsIn, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateNewsPostDto {
    @IsUUID()
    @IsNotEmpty()
    category_id: string

    @IsDateString({}, { message: 'publish_date must be YYYY-MM-DDTHH:mm:ss.sssZ format' })
    @IsNotEmpty()
    post_date: string

    @IsString()
    @IsNotEmpty()
    news_title: string

    @IsString()
    @IsNotEmpty()
    news_content: string

    @IsUUID()
    @IsNotEmpty()
    author_id: string
}


export enum NewsStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    BANNED = 'banned',
}
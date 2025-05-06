import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { CommentType } from "../entities/comment.entity";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    post_id: string

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    user_id: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(800, {message: "The maximum character of comment is 800"})
    comment: string

    @IsOptional()
    @IsUUID()
    parent_id?: string

    // @IsEnum(CommentType, { message: 'type must be either "comment" or "reply"' })
    // type: CommentType.COMMENT;

    @IsDateString({},{ message: 'date must be a valid ISO date string' })
    date: Date;
}

export class CreateReplayDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    post_id: string

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    user_id: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(800, {message: "The maximum character of comment is 800"})
    comment: string

    @IsOptional()
    @IsUUID()
    parent_id?: string

    // @IsEnum(CommentType, { message: 'type must be either "comment" or "reply"' })
    // type: CommentType.REPLY;

    @IsDateString({},{ message: 'date must be a valid ISO date string' })
    date: Date;
}
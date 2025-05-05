import { Column } from "typeorm";
import { ReactionType } from "../entities/react.entity";
import { IsDateString, IsEnum, IsUUID } from "class-validator";

export class CreateReactDto {
    @IsUUID()
    user_id: string;
  
    @IsUUID()
    post_id: string;
  
    @IsEnum(ReactionType, { message: 'type must be one of: like, love, haha, sad, angry' })
    type: ReactionType;
  
    @IsDateString({},{ message:'publishDate must be a valid ISO date string' })
    publishDate: Date;
  }
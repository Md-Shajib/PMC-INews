import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator"



export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(100, { message: 'Name must be at most 100 characters long' })
    name: string;

    @IsString()
    image_url?: string;
}

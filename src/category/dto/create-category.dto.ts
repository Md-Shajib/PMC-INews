import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator"



export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(30, { message: 'Name must be at most 30 characters long' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    @MaxLength(255, { message: 'Description must be at most 255 characters long' })
    description: string;
}

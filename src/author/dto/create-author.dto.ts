import { IsString, IsNotEmpty, MaxLength, IsEmail } from "class-validator";

export class CreateAuthorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Name must be less than or equal to 100 characters' })
    name: string;
  
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;
  
    @IsString()
    @IsNotEmpty()
    @MaxLength(500, { message: 'Bio must be less than or equal to 500 characters' })
    bio: string;
}

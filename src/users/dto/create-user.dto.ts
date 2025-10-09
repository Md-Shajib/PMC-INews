import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9\s'_-]+$/, { message: 'Name can only contain letters, spaces, hyphens, and apostrophes' })
    name: string;

    @IsEmail({}, {message: 'Invalid email address'})
    @MaxLength(50, {message: 'Email is too long'})
    email: string;

    @IsUrl()
    @IsOptional()
    image_url?: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(30, { message: 'Password must be at most 30 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
    })
    password: string;

}

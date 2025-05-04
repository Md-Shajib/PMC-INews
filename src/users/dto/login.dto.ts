import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

// dto/login.dto.ts
export class LoginDto {

    @IsEmail({}, {message: 'Invalid email address'})
    @MaxLength(50, {message: 'Email is too long'})
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(30, { message: 'Password must be at most 30 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
    })
    password: string;
  }
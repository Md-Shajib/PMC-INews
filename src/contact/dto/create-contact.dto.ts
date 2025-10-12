import { IsEmail, IsString } from "class-validator";

export class CreateContactDto {
    @IsString()
    name: string;

    @IsString()
    @IsEmail({}, { message: 'email must be a valid email address' })
    email: string;

    @IsString()
    title: string;

    @IsString()
    message: string;

    @IsString()
    web_url?: string;
}

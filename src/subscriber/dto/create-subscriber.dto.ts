import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateSubscriberDto {
    @IsEmail({}, { message: 'email must be a valid email address' })
    @IsNotEmpty({ message: 'email should not be empty' })
    email: string;

    @IsOptional()
    isActive?: boolean;
}

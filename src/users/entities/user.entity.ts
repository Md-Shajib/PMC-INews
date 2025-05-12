import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Role } from "src/auth/enum/role.enume";


@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type:'varchar', length:60 })
    @IsString()
    @MaxLength(50)
    @Matches(/^[a-zA-Z\s'_-]+$/, { message: 'Name can only contain letters, spaces, hyphens, and apostrophes' })
    name: string

    @Column({ type:'varchar', length:50, unique:true})
    @IsEmail({}, {message: 'Invalid email address'})
    @MaxLength(50, {message: 'Email is too long'})
    email: string;

    @Column({ type:'varchar', length:65 })
    @IsString()
    password: string;

    @Column({default: 'user'})
    role: Role.User;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 7);
    }
}

import * as bcrypt from 'bcryptjs';
import {
  IsEmail,
  IsString,
  MaxLength
} from 'class-validator';
import { Role } from 'src/auth/enum/role.enume';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  @IsString()
  @MaxLength(50)
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(50, { message: 'Email is too long' })
  email: string;

  @Column({ type: 'varchar', length: 65 })
  @IsString()
  password: string;

  @Column({ default: 'user' })
  role: Role;

  @Column({ nullable: true })
  image_url?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 7);
  }

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'int', default: 0 })
  views: number;
}

import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/auth/enum/role.enume';

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
}

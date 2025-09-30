import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsIn(['user', 'admin', 'author'], {
    message: 'Role must be either user, admin, or author',
  })
  @IsOptional()
  role?: string;
}

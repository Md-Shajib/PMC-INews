import { BadRequestException, Body, Get, Injectable, NotFoundException, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Request } from 'express';
import { validate as isUuid } from 'uuid';
import { Role } from 'src/auth/enum/role.enume';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...createUserDto, role: Role.User,
      });
      const savedUser = await this.usersRepository.save(newUser);
      const { password, ...result } = savedUser;
      return result as User;

    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation code
        throw new Error('User with this email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async logout(response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'Successfully Log Out',
    };
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(identifier: string) {
    const isEmail = identifier?.includes('@');
    const isValidUuid = isUuid(identifier);
    
    if (!isEmail && !isValidUuid) {
      throw new BadRequestException('Invalid identifier');
    }
    const foundUser = await this.usersRepository.findOne({
      where: isEmail ? { email: identifier } : { id: identifier }
    });
    if(!foundUser) throw new NotFoundException("User Not Found");

    return foundUser
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);

    return await this.usersRepository.save(user);
  }



  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return this.usersRepository.remove(user);
  }
}
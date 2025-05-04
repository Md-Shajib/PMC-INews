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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Create a new user entity with the DTO data
      const newUser = this.usersRepository.create(createUserDto);

      // console.log(newUser);

      // Save the user to the database
      const savedUser = await this.usersRepository.save(newUser);

      // Return the saved user (typically without the password)
      // You may want to exclude sensitive fields before returning
      const { password, ...result } = savedUser;
      return result as User;

    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation code
        throw new Error('User with this email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async login(loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { email, password } = loginDto;
    const user = await this.findOne(email)
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('Invalid email or passwoar')
    }
    // if(await bcrypt.compare(password, user.password)){
    //   return user;
    // }

    const jwt = await this.jwtService.signAsync({ id: user.id })

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'successfully login'
    };
  }

  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      // console.log(cookie)
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const identifier = data['id'];
      const userData = await this.findOne(identifier);

      return userData;

    } catch (e) {
      throw new UnauthorizedException();
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
    const isEmail = identifier.includes('@');
    const isValidUuid = isUuid(identifier);
    
    if (!isEmail && !isValidUuid) {
      throw new BadRequestException('Invalid identifier');
    }
  
    return await this.usersRepository.findOne({
      where: isEmail ? { email: identifier } : { id: identifier }
    });
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
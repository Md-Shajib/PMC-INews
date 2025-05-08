import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Res } from '@nestjs/common';
import { response, Response } from 'express';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Post('login')
  // login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
  //   return this.usersService.login(loginDto, res);
  // }
  
  // @Get('user')
  // user(@Req() request: Request) {
  //   return this.usersService.user(request);
  // }


  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.usersService.logout(response);
  }
  
  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

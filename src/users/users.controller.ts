import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Res } from '@nestjs/common';
import { response, Response } from 'express';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import { Public, Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enum/role.enume';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.usersService.logout(response);
  }

  @Get('all')
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Author, Role.User)
  async findOne(@Param('id') id: string) {
    const getUser = await this.usersService.findOne(id);
    const { password, ...userWithoutPass } = getUser;
    return userWithoutPass;
  }

  @Get('count/total')
  @Roles(Role.Admin)
  async userCount() {
    const totalUser = await this.usersService.userCount();
    return totalUser;
  }

@Patch(':id/update')
@Roles(Role.Admin, Role.Author, Role.User)
update(
  @Param('id') id: string, 
  @Body() updateUserDto: UpdateUserDto,
  @CurrentUser() currentUser: User,   // 👈 get the logged-in user
) {
  return this.usersService.update(id, updateUserDto, currentUser);
}

  @Delete(':id/delete')
  @Roles(Role.Admin, Role.Author, Role.User)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

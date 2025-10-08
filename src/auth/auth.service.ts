
import { Injectable, Param, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    
    const user = await this.usersService.findOneByEmail(email);

    if(!user) {
        throw new UnauthorizedException("User not found");
    }

    const isPasswordMatched = await bcrypt.compare(pass, user.password as any)
    if (!isPasswordMatched) {
      throw new UnauthorizedException("Wrong Password");
    }
    const payload = {id: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return {
      access_token: access_token
    };
  }
}

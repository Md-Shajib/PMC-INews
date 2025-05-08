import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>){
        const access_token = this.authService.signIn(signInDto.email, signInDto.password);
        // console.log(access_token);
        return access_token;
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getProfile(@Request() req){
        return req.user;
    }
}

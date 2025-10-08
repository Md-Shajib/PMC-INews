import { Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';


@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService, private usersService: UsersService ){}

    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>){
        // console.log(signInDto);
        const access_token = this.authService.signIn(signInDto.email, signInDto.password);
        return access_token;
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getProfile(@Request() req){
        const userId = req.user.id;
        return this.usersService.findOneByIdentifier(userId);
    }
}

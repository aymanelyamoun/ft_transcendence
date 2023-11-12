import { Body, Controller, Get, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { IAuthService } from './auth';
import { Services } from 'src/utils/constants';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { IUserService } from 'src/users/user';
// import { UsersService } from '../users/users.service'

@Controller('auth')
export class AuthController {
    constructor(@Inject(Services.AUTH) private authService: IAuthService, 
    @Inject(Services.USERS) private userService:IUserService) { }

    @Post('register')
    @UsePipes(ValidationPipe)
    registerUser(@Body() createUserDto: CreateUserDto)
    {
        console.log(createUserDto);
        this.userService.createUser(createUserDto);
    }

    @Post('login')
    login()
    {
    }

    @Get('status')
    status()
    {
    }

    @Post('logout')
    logout()
    {
    }
}

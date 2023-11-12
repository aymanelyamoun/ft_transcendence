import { Injectable } from '@nestjs/common';
import { IUserService } from './user';
import { CreateUserDetails } from 'src/utils/types';

@Injectable()
export class UsersService implements IUserService{
    createUser(userDetails:CreateUserDetails) {
        console.log("user service implementation was called");
    }
}

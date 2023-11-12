import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/users/user';

@Injectable()
export class AuthService implements IAuthService {
    constructor(){};
    validateUser() {
    }
}

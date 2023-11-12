import { IUserService } from './user';
import { CreateUserDetails } from 'src/utils/types';
export declare class UsersService implements IUserService {
    createUser(userDetails: CreateUserDetails): void;
}

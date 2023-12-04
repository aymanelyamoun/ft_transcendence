import { IsEmail, IsString } from "class-validator";


export class CreateUserDto{
    @IsString()
    displayName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
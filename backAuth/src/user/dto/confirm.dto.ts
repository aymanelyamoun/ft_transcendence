import { IsEmail, IsString } from "class-validator";


export class ConfirmUserDto{
    @IsString()
    displayName: string;

     @IsString()
    profilePic: string;

    @IsString()
    password: string;
}
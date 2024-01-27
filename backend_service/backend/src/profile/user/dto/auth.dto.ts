import { Transform } from "class-transformer";
import {IsEmail, IsNotEmpty, IsString  } from "class-validator"

export class LoginDto{
    @IsEmail({}, {message: 'Invalid email format.'})
    @IsNotEmpty({ message: 'Email is required.' })
    @Transform(({ value }) => value.trim()) 
    email: string;

    @IsString({ message: 'Password must be a string.' })
    @IsNotEmpty({ message: 'Password is required.' })
    hash: string;
}
import { Transform } from "class-transformer";
import {IsEmail, IsNotEmpty, IsString  } from "class-validator"

export class SkinDto{
    Name: string;
    Type: string;
}
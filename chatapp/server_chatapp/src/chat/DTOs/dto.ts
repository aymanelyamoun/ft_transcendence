import { IsString, IsNotEmpty } from 'class-validator';

export class userDataDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    usernameId: string;

    // @IsString()
    // @IsNotEmpty()
    // messageTo: string;
}

export class messageDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    messageTo: string;

    @IsString()
    @IsNotEmpty()
    messageFrom?: string;

    @IsString()
    @IsNotEmpty()
    event?: string;
}
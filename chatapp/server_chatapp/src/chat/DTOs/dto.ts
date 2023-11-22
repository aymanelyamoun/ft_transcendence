import { IsString, IsNotEmpty } from 'class-validator';

export class userDataDto {
    // @IsString()
    // @IsNotEmpty()
    // username: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

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

export class CreateChannelDto{
    @IsNotEmpty()
    @IsString()
    channelName: string;
    
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    admines?: string[]

    @IsNotEmpty()
    @IsString()
    creator: string
}
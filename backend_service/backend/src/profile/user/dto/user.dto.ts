import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username is required.' })
  @Transform(({ value }) => value.trim()) 
  username: string;

  @IsEmail({}, {message: 'Invalid email format.'})
  @IsNotEmpty({ message: 'Email is required.' })
  @Transform(({ value }) => value.trim()) 
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  hash: string;

  @IsString({ message: 'Confirm Password must be a string.' })
  @IsNotEmpty({ message: 'Confirm Password  is required.' })
  hashConfirm: string;
}

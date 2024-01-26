import { IsString, IsNotEmpty, Matches, MinLength, MaxLength, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username is required.' })
  @MinLength(4, { message: 'Username must be at least 4 characters long.' })
  @MaxLength(20, { message: 'Username cannot be longer than 20 characters.' })
  @Transform(({ value }) => value.trim())
  username: string;

  @IsEmail({}, {message: 'Invalid email format.'})
  @IsNotEmpty({ message: 'Email is required.' })
  @Transform(({ value }) => value.trim()) 
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
  hash: string;

  @IsString({ message: 'Confirm Password must be a string.' })
  @IsNotEmpty({ message: 'Confirm Password  is required.' })
  hashConfirm: string;
}

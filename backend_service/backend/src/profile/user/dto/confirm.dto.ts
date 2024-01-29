import { IsString, IsNotEmpty, Matches, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ConfirmUserDto {
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username is required.' })
  @MinLength(4, { message: 'Username must be at least 4 characters long.' })
  @MaxLength(20, { message: 'Username cannot be longer than 20 characters.' })
  @Transform(({ value }) => value.trim())
  username: string;

  @IsString({ message: 'Profile picture must be a string.' })
  @IsNotEmpty({ message: 'Profile picture is required.' })
  profilePic: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(4, { message: 'Password must be at least 4 characters long.' })
  @MaxLength(20, { message: 'Password cannot be longer than 20 characters.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
  hash: string;

  @IsString({ message: 'Confirm password must be a string.' })
  @IsNotEmpty({ message: 'Confirm password is required.' })
  confirmPass: string;
}



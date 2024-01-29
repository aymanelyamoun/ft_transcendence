import { IsString, IsNotEmpty, Matches, MinLength, MaxLength } from 'class-validator';

export class UpdatePassDto {
  @IsString({ message: 'Old password must be a string.' })
  @IsNotEmpty({ message: 'Old password is required.' })
  oldPass: string;

  @IsString({ message: 'New password must be a string.' })
  @IsNotEmpty({ message: 'New password is required.' })
  @MinLength(4, { message: 'Password must be at least 4 characters long.' })
  @MaxLength(20, { message: 'Password cannot be longer than 20 characters.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
  newPass: string;

  @IsString({ message: 'Confirm password must be a string.' })
  @IsNotEmpty({ message: 'confirm password is required.' })
  confirmPass: string;
}
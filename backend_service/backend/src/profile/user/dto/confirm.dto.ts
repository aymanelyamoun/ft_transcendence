import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmUserDto {
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username is required.' })
  username: string;

  @IsString({ message: 'Profile picture must be a string.' })
  @IsNotEmpty({ message: 'Profile picture is required.' })
  profilePic: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  hash: string;
}

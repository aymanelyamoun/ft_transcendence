import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePassDto {
  @IsString({ message: 'Old password must be a string.' })
  @IsNotEmpty({ message: 'Old password is required.' })
  oldPass: string;

  @IsString({ message: 'New password must be a string.' })
  @IsNotEmpty({ message: 'New password is required.' })
  newPass: string;

  @IsString({ message: 'Confirm password must be a string.' })
  @IsNotEmpty({ message: 'confirm password is required.' })
  confirmPass: string;
}// onChange={(e) => (data.current.username = e.target.value)}
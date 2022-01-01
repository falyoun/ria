import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  name: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  phoneNumber: string;
  @IsBoolean()
  isActive: boolean;
  @IsBoolean()
  isVerified: boolean;
}

import { UserDto } from '@app/user';
import { IsString } from 'class-validator';

export class LoginResponseDto extends UserDto {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
}

import { IsString } from 'class-validator';
import { UserDto } from '@app/user/dtos/user.dto';

export class LoginResponseDto extends UserDto {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
}

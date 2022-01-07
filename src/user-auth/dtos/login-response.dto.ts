import { UserDto } from '@app/user';
import { TokensDto } from '@app/spa';

export class LoginResponseDto extends TokensDto {
  user: UserDto;
}

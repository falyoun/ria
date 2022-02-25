import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';

export class LoginDto extends PickType<CreateUserDto, 'email' | 'password'>(
  CreateUserDto,
  ['email', 'password'] as const,
) {}

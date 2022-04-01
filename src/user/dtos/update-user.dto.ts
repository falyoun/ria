import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { AppRole } from '@app/role/enums/app-role.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {}

export class PatchUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'avatarId'] as const),
) {
  @IsEnum(AppRole)
  @IsOptional()
  role?: AppRole;
}

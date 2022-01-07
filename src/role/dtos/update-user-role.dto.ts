import { AppRole } from '../enums';
import { IsEnum, IsPositive } from 'class-validator';

export class UpdateUserRoleDto {
  @IsEnum(AppRole)
  newRole: AppRole;

  @IsPositive()
  userId: number;
}

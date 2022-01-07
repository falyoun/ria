import { IsEnum, IsPositive } from 'class-validator';
import { AppRole } from '../enums';

export class CreateUserRoleDto {
  @IsPositive()
  userId: number;

  @IsEnum(AppRole)
  requiredRole: AppRole;
}

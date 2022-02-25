import { IsEnum, IsPositive } from 'class-validator';
import { AppRole } from '@app/role/enums/app-role.enum';

export class CreateUserRoleDto {
  @IsPositive()
  userId: number;

  @IsEnum(AppRole)
  requiredRole: AppRole;
}

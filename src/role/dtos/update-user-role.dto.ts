import { IsEnum, IsPositive } from 'class-validator';
import { AppRole } from '@app/role/enums/app-role.enum';

export class UpdateUserRoleDto {
  @IsEnum(AppRole)
  newRole: AppRole;

  @IsPositive()
  userId: number;
}

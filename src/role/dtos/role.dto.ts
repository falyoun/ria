import { IsEnum, IsPositive } from 'class-validator';
import { AppRole } from '@app/role';

export class RoleDto {
  @IsPositive()
  id: number;

  @IsEnum(AppRole)
  name: AppRole;
}

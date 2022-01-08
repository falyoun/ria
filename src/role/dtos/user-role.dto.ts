import { Allow, IsPositive } from 'class-validator';
import { RoleDto } from './role.dto';

export class UserRoleDto {
  @IsPositive()
  id: number;
  @IsPositive()
  roleId: number;
  @Allow()
  role?: RoleDto;
  @IsPositive()
  userId: number;
}

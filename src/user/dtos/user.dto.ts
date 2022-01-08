import { Allow, IsBoolean, IsEmail, IsString } from 'class-validator';
import { AppRole, UserRoleDto } from '@app/role';

export class UserDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  phoneNumber: string;
  @IsBoolean()
  isActive: boolean;
  @IsBoolean()
  isVerified: boolean;
  @Allow()
  associatedRoles: UserRoleDto[];
  @Allow()
  roles: AppRole[];
}

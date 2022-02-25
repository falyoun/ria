import { Allow, IsBoolean, IsEmail, IsString } from 'class-validator';
import { UserRoleDto } from '@app/role/dtos/user-role.dto';
import { AppRole } from '@app/role/enums/app-role.enum';
import { ReceiptDto } from '@app/departments/financial/dtos/receipt/receipt.dto';

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
  @Allow()
  receipts: ReceiptDto[];
}

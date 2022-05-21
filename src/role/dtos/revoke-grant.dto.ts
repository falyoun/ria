import { IsPositive } from 'class-validator';

export class RevokeGrantDto {
  @IsPositive()
  userId: number;
  @IsPositive()
  roleId: number;
  @IsPositive()
  grantId: number;
}

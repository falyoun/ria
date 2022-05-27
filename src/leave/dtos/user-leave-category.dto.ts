import { Allow, IsNumber, IsPositive } from 'class-validator';
import { LeaveCategoryDto } from '@app/leave/dtos/leave-category.dto';
import { UserDto } from '@app/user/dtos/user.dto';

export class UserLeaveCategoryDto {
  @IsPositive()
  id?: number;

  @IsPositive()
  leaveCategoryId: number;

  @Allow()
  leaveCategory?: LeaveCategoryDto;

  @IsPositive()
  userId: number;

  @Allow()
  user?: UserDto;

  @IsNumber()
  numberOfDaysAllowed: number;
}

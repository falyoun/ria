import { Allow, IsNumber, IsPositive } from 'class-validator';

export class UpdateUserLeavesCategoriesForUser {
  @IsPositive()
  leaveCategoryId: number;
  @IsNumber()
  numberOfDaysAllowed: number;
}
export class ReplaceUserLeavesCategoriesForUserDto {
  @IsPositive()
  userId: number;

  @Allow()
  userLeavesCategories: UpdateUserLeavesCategoriesForUser[];
}

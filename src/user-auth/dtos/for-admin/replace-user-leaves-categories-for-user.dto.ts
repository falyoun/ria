import { IsNumber, IsPositive } from 'class-validator';

export class UpdateUserLeavesCategoriesForUser {
  @IsPositive()
  leaveCategoryId: number;
  @IsNumber()
  numberOfDaysAllowed: number;
}
export class ReplaceUserLeavesCategoriesForUserDto {
  userId: number;
  userLeavesCategories: UpdateUserLeavesCategoriesForUser[];
}

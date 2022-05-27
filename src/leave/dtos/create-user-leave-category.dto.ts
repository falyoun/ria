import { IsNumber, IsPositive } from 'class-validator';

export class CreateUserLeaveCategoryDto {
  @IsPositive()
  userId: number;
  @IsPositive()
  leaveCategoryId: number;
  @IsNumber()
  numberOfDaysAllowed: number;
}

import { IsNumber, IsPositive, IsString } from 'class-validator';

export class LeaveCategoryDto {
  @IsPositive()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  deductionAmount: number;
}

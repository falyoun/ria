import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLeaveCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  deductionAmount: number;
}

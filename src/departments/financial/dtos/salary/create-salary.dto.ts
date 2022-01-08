import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateSalaryDto {
  @IsPositive()
  receiptId: number;

  @IsDate()
  workStartDate: Date;

  @IsDate()
  workEndDate: Date;

  @IsNumber()
  amount: number;

  @IsNumber()
  @IsOptional()
  bonus?: number;

  @IsNumber()
  @IsOptional()
  allowance?: number;
}

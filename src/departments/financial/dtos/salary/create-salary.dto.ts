import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReceiptSalaryDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  workStartDate: Date;

  @Transform(({ value }) => new Date(value))
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
export class CreateSalaryDto extends CreateReceiptSalaryDto {
  @IsPositive()
  receiptId: number;
}

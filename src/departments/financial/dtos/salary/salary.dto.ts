import { Allow, IsDate, IsNumber, IsPositive } from 'class-validator';
import { ReceiptDto } from '@app/departments/financial/dtos/receipt/receipt.dto';

export class SalaryDto {
  @IsPositive()
  id: number;

  @IsPositive()
  receiptId: number;

  @Allow()
  receipt: ReceiptDto;

  @IsDate()
  workStartDate: Date;

  @IsDate()
  workEndDate: Date;

  @IsNumber()
  amount: number;

  @IsNumber()
  bonus?: number;

  @IsNumber()
  allowance?: number;
}

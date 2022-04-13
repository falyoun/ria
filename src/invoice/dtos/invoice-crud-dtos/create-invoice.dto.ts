import { IsDate, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInvoiceDto {
  @Transform(({ value }) => +value)
  @IsPositive()
  grossAmount: number;

  @Transform(({ value }) => +value)
  @IsPositive()
  netAmount: number;

  @IsString()
  @IsNotEmpty()
  taxNumber: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dueDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  issueDate: Date;
}

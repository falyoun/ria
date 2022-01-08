import {
  IsArray,
  IsNotEmptyObject,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateReceiptSalaryDto } from '../salary';
import { CreateDeductionDto, CreateReceiptDeductionDto } from '../deduction';
import { PickType } from '@nestjs/swagger';
export class RequestNewReceipt {
  @IsPositive()
  userId: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateReceiptSalaryDto)
  salary: CreateReceiptSalaryDto;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateReceiptDeductionDto)
  deductions?: CreateReceiptDeductionDto[];
}
export class CreateReceiptDto extends PickType<
  RequestNewReceipt,
  'salary' | 'deductions'
>(RequestNewReceipt, ['salary', 'deductions'] as const) {}

import {
  IsArray,
  IsNotEmptyObject,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { CreateReceiptSalaryDto } from '@app/departments/financial/dtos/salary/create-salary.dto';
import { CreateReceiptDeductionDto } from '@app/departments/financial/dtos/deduction/create-deduction.dto';
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
export class CreateReceiptDto extends PickType(RequestNewReceipt, [
  'salary',
  'deductions',
] as const) {}

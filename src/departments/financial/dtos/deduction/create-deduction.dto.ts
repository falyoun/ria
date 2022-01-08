import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { DeductionTypeEnum } from '../../enums';
export class CreateReceiptDeductionDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(DeductionTypeEnum)
  type: DeductionTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  reason: string;
}
export class CreateDeductionDto extends CreateReceiptDeductionDto {
  @IsPositive()
  receiptId: number;
}

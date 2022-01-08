import { DeductionTypeEnum } from '../../enums';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class DeductionDto {
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

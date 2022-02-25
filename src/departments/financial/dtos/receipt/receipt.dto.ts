import { Allow, IsArray, IsPositive, ValidateNested } from 'class-validator';
import { SalaryDto } from '../salary';
import { DeductionDto } from '../deduction';
import { Type } from 'class-transformer';
import { UserDto } from '@app/user/dtos/user.dto';

export class ReceiptDto {
  @IsPositive()
  id: number;

  @Allow()
  @ValidateNested()
  @Type(() => SalaryDto)
  salary?: SalaryDto;

  @Allow()
  @ValidateNested()
  @Type(() => UserDto)
  user?: UserDto;

  @Allow()
  @IsArray()
  @ValidateNested()
  @Type(() => DeductionDto)
  deductions?: DeductionDto[];
}

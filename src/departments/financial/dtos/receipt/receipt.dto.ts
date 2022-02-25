import { Allow, IsArray, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '@app/user/dtos/user.dto';
import { SalaryDto } from '@app/departments/financial/dtos/salary/salary.dto';
import { DeductionDto } from '@app/departments/financial/dtos/deduction/deduction.dto';

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

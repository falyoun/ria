import {
  IsArray,
  IsEnum,
  IsPositive,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeLevelEnum } from '@app/salary-scale/enums/employee-level.enum';

export class CreateSalaryScaleSingleEntityDto {
  @IsPositive()
  jobId: number;

  @IsPositive()
  amount: number;

  @IsEnum(EmployeeLevelEnum)
  employeeLevel: EmployeeLevelEnum;
}
export class CreateSalaryScaleDto {
  @IsArray()
  @Type(() => CreateSalaryScaleSingleEntityDto)
  @ValidateNested({
    each: true,
  })
  @MinLength(1)
  entities: CreateSalaryScaleSingleEntityDto[];
}

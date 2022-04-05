import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeLevelEnum } from '@app/departments/financial/salary-scale/enums/employee-level.enum';

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
  @ArrayMinSize(1)
  @Type(() => CreateSalaryScaleSingleEntityDto)
  @ValidateNested({
    each: true,
  })
  entities: CreateSalaryScaleSingleEntityDto[];
}

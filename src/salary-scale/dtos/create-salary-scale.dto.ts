import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsPositive,
  Min,
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
  @ArrayMinSize(1)
  entities: CreateSalaryScaleSingleEntityDto[];
}

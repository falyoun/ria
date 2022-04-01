import { IsEnum, IsPositive } from 'class-validator';
import { EmployeeLevelEnum } from '@app/departments/financial/salary-scale/enums/employee-level.enum';

export class AssignJobToUserDto {
  @IsPositive()
  jobId: number;
  @IsEnum(EmployeeLevelEnum)
  level: EmployeeLevelEnum;
}

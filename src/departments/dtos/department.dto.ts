import { Allow, IsPositive, IsString } from 'class-validator';
import { UserDto } from '@app/user/dtos/user.dto';
import { JobDto } from '@app/departments/financial/salary-scale/job/dtos/job.dto';

export class DepartmentDto {
  @IsPositive()
  id?: number;

  @IsString()
  title: string;

  @IsPositive()
  maxNumberOfEmployees?: number;

  @Allow()
  users?: UserDto[];

  @Allow()
  jobs?: JobDto[];
}

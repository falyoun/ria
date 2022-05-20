import {
  Allow,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { DepartmentDto } from '@app/departments/dtos/department.dto';

export class JobDto {
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsPositive()
  departmentId: number;

  @Allow()
  department: DepartmentDto;
}

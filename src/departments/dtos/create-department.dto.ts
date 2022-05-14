import { PickType } from '@nestjs/swagger';
import { DepartmentDto } from '@app/departments/dtos/department.dto';

export class CreateDepartmentDto extends PickType(DepartmentDto, [
  'maxNumberOfEmployees',
  'title',
]) {}

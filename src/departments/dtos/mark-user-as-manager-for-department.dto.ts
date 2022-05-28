import { IsPositive } from 'class-validator';

export class MarkUserAsManagerForDepartmentDto {
  @IsPositive()
  userId: number;
}

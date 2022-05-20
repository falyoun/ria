import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsPositive()
  departmentId: number;
}

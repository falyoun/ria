import { SalaryScaleJobDto } from '@app/salary-scale/dtos/salary-scale-job.dto';
import { Allow, IsBoolean, IsPositive } from 'class-validator';

export class SalaryScaleDto {
  @IsPositive()
  id: number;

  @IsBoolean()
  isActive: boolean;

  @Allow()
  salaryScaleJobs: SalaryScaleJobDto[];
}

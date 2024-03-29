import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateJobDto } from '@app/departments/financial/salary-scale/job/dtos/create-job.dto';

export class UpdateJobDto extends PartialType(
  OmitType(CreateJobDto, ['departmentId']),
) {}

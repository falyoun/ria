import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from '@app/salary-scale/job/dtos/create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}

import { Module } from '@nestjs/common';
import { JobService } from '@app/departments/financial/salary-scale/job/job.service';
import { JobController } from '@app/departments/financial/salary-scale/job/job.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Job } from '@app/departments/financial/salary-scale/job/job.model';

@Module({
  imports: [SequelizeModule.forFeature([Job])],
  providers: [JobService],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}

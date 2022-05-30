import { Module } from '@nestjs/common';
import { JobService } from '@app/departments/financial/salary-scale/job/job.service';
import { JobController } from '@app/departments/financial/salary-scale/job/job.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Job } from '@app/departments/financial/salary-scale/job/job.model';
import { User } from '@app/user/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Job, User])],
  providers: [JobService],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}

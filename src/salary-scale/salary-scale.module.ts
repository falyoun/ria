import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SalaryScaleJob } from '@app/salary-scale/models/salary-scale-job.model';
import { SalaryScale } from '@app/salary-scale/models/salary-scale.model';
import { JobModule } from '@app/salary-scale/job/job.module';
import { SalaryScaleService } from '@app/salary-scale/salary-scale.service';
import { SalaryScaleController } from '@app/salary-scale/salary-scale.controller';

@Module({
  imports: [
    JobModule,
    SequelizeModule.forFeature([SalaryScaleJob, SalaryScale]),
  ],
  providers: [SalaryScaleService],
  controllers: [SalaryScaleController],
  exports: [JobModule, SalaryScaleService],
})
export class SalaryScaleModule {}

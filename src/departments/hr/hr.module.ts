import { Module } from '@nestjs/common';
import { HrController } from '@app/departments/hr/controllers/hr.controller';
import { HrService } from '@app/departments/hr/services/hr.service';

@Module({
  imports: [],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}

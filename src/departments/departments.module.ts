import { Module } from '@nestjs/common';
import { FinancialModule } from './financial';
import { HrModule } from './hr';

@Module({
  imports: [FinancialModule, HrModule],
  exports: [FinancialModule, HrModule],
})
export class DepartmentsModule {}

import { Module } from '@nestjs/common';
import { FinancialModule } from '@app/departments/financial/financial.module';
import { HrModule } from '@app/departments/hr/hr.module';

@Module({
  imports: [FinancialModule, HrModule],
  exports: [FinancialModule, HrModule],
})
export class DepartmentsModule {}

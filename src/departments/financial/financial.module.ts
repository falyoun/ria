import { Module } from '@nestjs/common';
import { DeductionService, ReceiptService, SalaryService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { Deduction, Receipt, Salary } from './models';

@Module({
  imports: [SequelizeModule.forFeature([Salary, Deduction, Receipt])],
  controllers: [],
  providers: [SalaryService, DeductionService, ReceiptService],
  exports: [SalaryService, DeductionService, ReceiptService],
})
export class FinancialModule {}

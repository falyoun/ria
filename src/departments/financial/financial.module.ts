import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Salary } from '@app/departments/financial/models/salary.model';
import { SalaryService } from '@app/departments/financial/services/salary.service';
import { Deduction } from '@app/departments/financial/models/deduction.model';
import { DeductionService } from '@app/departments/financial/services/deduction.service';
import { ReceiptService } from '@app/departments/financial/services/receipt.service';
import { Receipt } from '@app/departments/financial/models/receipt.model';
import { ReceiptsController } from '@app/departments/financial/controllers/receipts.controller';
import { UserModule } from '@app/user/user.module';
import { SalaryScaleModule } from '@app/departments/financial/salary-scale/salary-scale.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Salary, Deduction, Receipt]),
    SalaryScaleModule,
    UserModule,
  ],
  controllers: [ReceiptsController],
  providers: [SalaryService, DeductionService, ReceiptService],
  exports: [SalaryService, DeductionService, ReceiptService],
})
export class FinancialModule {}

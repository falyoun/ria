import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReceiptService } from '@app/departments/financial/services/receipt.service';
import { Receipt } from '@app/departments/financial/models/receipt.model';
import { UserModule } from '@app/user/user.module';
import { SalaryScaleModule } from '@app/departments/financial/salary-scale/salary-scale.module';
import { SalaryService } from '@app/departments/financial/services/salary.service';
import { DeductionService } from '@app/departments/financial/services/deduction.service';
import { Salary } from '@app/departments/financial/models/salary.model';
import { Deduction } from '@app/departments/financial/models/deduction.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Receipt, Salary, Deduction]),
    SalaryScaleModule,
    forwardRef(() => UserModule),
  ],
  providers: [ReceiptService, SalaryService, DeductionService],
  exports: [ReceiptService],
})
export class ReceiptModule {}

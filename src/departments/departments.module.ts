import { Module } from '@nestjs/common';
import { FinancialModule } from '@app/departments/financial/financial.module';
import { HrModule } from '@app/departments/hr/hr.module';
import { DepartmentsController } from '@app/departments/controllers/departments.controller';
import { DepartmentsService } from '@app/departments/services/departments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from '@app/departments/models/department.model';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [
    FinancialModule,
    HrModule,
    SequelizeModule.forFeature([Department]),
    UserModule,
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [FinancialModule, HrModule, DepartmentsService],
})
export class DepartmentsModule {}

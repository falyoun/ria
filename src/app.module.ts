import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppDatabaseModule } from '@app/global/app-database/app-database.module';
import { AppConfigModule } from '@app/global/app-config/app-config.module';
import { UserAuthModule } from '@app/user-auth/user-auth.module';
import { DepartmentsModule } from '@app/departments/departments.module';
import { TicketsModule } from '@app/tickets/tickets.module';
import { SalaryScaleModule } from '@app/departments/financial/salary-scale/salary-scale.module';
import { InvoiceModule } from '@app/invoice/invoice.module';
import { BeneficiaryModule } from '@app/beneficiary/beneficiary.module';

@Module({
  imports: [
    AppDatabaseModule,
    AppConfigModule,
    UserAuthModule,
    SalaryScaleModule,
    DepartmentsModule,
    InvoiceModule,
    BeneficiaryModule,
    TicketsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
      serveRoot: '/api/v1/public',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

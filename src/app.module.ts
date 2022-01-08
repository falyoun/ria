import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/app-config';
import { AppDatabaseModule } from '@app/app-database';
import { UserAuthModule } from '@app/user-auth';
import { DepartmentsModule } from '@app/departments';
@Module({
  imports: [
    AppDatabaseModule,
    AppConfigModule,
    UserAuthModule,
    DepartmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/app-config';
import { AppDatabaseModule } from '@app/app-database';
import { UserAuthModule } from '@app/user-auth';
@Module({
  imports: [AppDatabaseModule, AppConfigModule, UserAuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

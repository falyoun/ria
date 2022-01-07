import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/app-config';
import { AppDatabaseModule } from '@app/app-database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAuthModule } from '@app/user-auth';
@Module({
  imports: [AppDatabaseModule, AppConfigModule, UserAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

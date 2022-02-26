import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppDatabaseModule } from '@app/global/app-database/app-database.module';
import { AppConfigModule } from '@app/global/app-config/app-config.module';
import { UserAuthModule } from '@app/user-auth/user-auth.module';
import { DepartmentsModule } from '@app/departments/departments.module';
import { TicketsModule } from '@app/tickets/tickets.module';
console.log(join(__dirname, '../', 'public/avatars'));
@Module({
  imports: [
    AppDatabaseModule,
    AppConfigModule,
    UserAuthModule,
    DepartmentsModule,
    TicketsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public/avatars'),
      serveRoot: '/api/v1/public/avatars',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/app-config';
import { AppDatabaseModule } from '@app/app-database';
import { UserAuthModule } from '@app/user-auth';
import { DepartmentsModule } from '@app/departments';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
console.log(join(__dirname, '../', 'public/avatars'));
@Module({
  imports: [
    AppDatabaseModule,
    AppConfigModule,
    UserAuthModule,
    DepartmentsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public/avatars'),
      serveRoot: '/api/v1/public/avatars',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

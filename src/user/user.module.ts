import { Module } from '@nestjs/common';
import {
  UserController,
  UserFinancialController,
  UserForAdminController,
} from './controllers';
import { UserForAdminService, UserService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';
import { RoleModule } from '@app/role';
import { FinancialModule } from '@app/departments';
import { AppFileModule } from '../global/app-file/app-file.module';

@Module({
  imports: [
    FinancialModule,
    RoleModule,
    SequelizeModule.forFeature([User]),
    AppFileModule,
  ],
  controllers: [
    UserController,
    UserForAdminController,
    UserFinancialController,
  ],
  providers: [UserService, UserForAdminService],
  exports: [
    UserService,
    UserForAdminService,
    SequelizeModule.forFeature([User]),
    RoleModule,
  ],
})
export class UserModule {}

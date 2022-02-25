import { Module } from '@nestjs/common';
import { FinancialModule } from '@app/departments';
import { AppFileModule } from '../global/app-file/app-file.module';
import { RoleModule } from '@app/role/role.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@app/user/models/user.model';
import { UserController } from '@app/user/controllers/user.controller';
import { UserForAdminController } from '@app/user/controllers/user-for-admin.controller';
import { UserFinancialController } from '@app/user/controllers/user-financial.controller';
import { UserService } from '@app/user/services/user.service';
import { UserForAdminService } from '@app/user/services/user-for-admin.service';

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

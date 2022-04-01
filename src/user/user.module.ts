import { Module } from '@nestjs/common';
import { AppFileModule } from '../global/app-file/app-file.module';
import { RoleModule } from '@app/role/role.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@app/user/models/user.model';
import { UserController } from '@app/user/controllers/user.controller';
import { UserForAdminController } from '@app/user/controllers/user-for-admin.controller';
import { UserService } from '@app/user/services/user.service';
import { UserForAdminService } from '@app/user/services/user-for-admin.service';
import { JobModule } from '@app/departments/financial/salary-scale/job/job.module';

@Module({
  imports: [
    RoleModule,
    SequelizeModule.forFeature([User]),
    AppFileModule,
    JobModule,
  ],
  controllers: [UserController, UserForAdminController],
  providers: [UserService, UserForAdminService],
  exports: [
    UserService,
    UserForAdminService,
    SequelizeModule.forFeature([User]),
    RoleModule,
  ],
})
export class UserModule {}

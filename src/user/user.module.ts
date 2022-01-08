import { Module } from '@nestjs/common';
import { UserController, UserForAdminController } from './controllers';
import { UserForAdminService, UserService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';
import { RoleModule } from '@app/role';

@Module({
  imports: [RoleModule, SequelizeModule.forFeature([User])],
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

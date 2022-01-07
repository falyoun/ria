import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models';
import { RoleModule } from '@app/role';

@Module({
  imports: [RoleModule, SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule.forFeature([UserModel])],
})
export class UserModule {}

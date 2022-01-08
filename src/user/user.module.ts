import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';
import { RoleModule } from '@app/role';

@Module({
  imports: [RoleModule, SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule.forFeature([User])],
})
export class UserModule {}

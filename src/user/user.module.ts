import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

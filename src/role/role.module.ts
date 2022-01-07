import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Grant, Role, UserRole } from './models';
import { RolesBuilderService, RoleService, UserRoleService } from './serviecs';

@Module({
  imports: [SequelizeModule.forFeature([Role, Grant, UserRole])],
  providers: [RoleService, UserRoleService, RolesBuilderService],
  controllers: [],
  exports: [
    RoleService,
    UserRoleService,
    RolesBuilderService,
    SequelizeModule.forFeature([Role, Grant, UserRole]),
  ],
})
export class RoleModule {}

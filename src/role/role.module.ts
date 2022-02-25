import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from '@app/role/serviecs/role.service';
import { RolesBuilderService } from '@app/role/serviecs/roles-builder.service';
import { UserRoleService } from '@app/role/serviecs/user-role.service';
import { UserRole } from '@app/role/models/user-role.model';
import { Grant } from '@app/role/models/grant.model';
import { Role } from '@app/role/models/role.model';

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

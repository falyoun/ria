import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RoleDto } from '@app/role/dtos/role.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { UserRoleService } from '@app/role/serviecs/user-role.service';
import { FindManyUsersRolesDto } from '@app/role/dtos/find-many-users-roles.dto';
import { CreateGrantDto } from '@app/role/dtos/grant/create-grant.dto';
import { RequestUser } from '@app/spa-authentication';
import { User } from '@app/user/models/user.model';
import { RevokeGrantDto } from '@app/role/dtos/revoke-grant.dto';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { UserRoleDto } from '@app/role/dtos/user-role.dto';
import { GrantDto } from '@app/role/dtos/grant/grant-dto';

@ApiTags('Roles')
@Controller('roles')
@ApiExtraModels(RoleDto, FindManyUsersRolesDto, UserRoleDto, GrantDto)
@UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
export class RoleController {
  constructor(private readonly userRolesService: UserRoleService) {}

  @ApiRiaDto(UserRoleDto)
  @Post('grant')
  addNewGrantToRole(
    @RequestUser() user: User,
    @Body() createNewGrant: CreateGrantDto,
  ) {
    return this.userRolesService.addNewGrantToUserRole(createNewGrant);
  }

  @ApiRiaDto(UserRoleDto)
  @Post('revoke-grant')
  revokeGrant(@Body() revokeGrantDto: RevokeGrantDto) {
    return this.userRolesService.revokeGrant(revokeGrantDto);
  }

  @ApiPaginatedDto(UserRoleDto)
  @Get()
  getAllRoles(@Query() findManyUsersRolesDto: FindManyUsersRolesDto) {
    return this.userRolesService.getAllUsersRoles(findManyUsersRolesDto);
  }
}

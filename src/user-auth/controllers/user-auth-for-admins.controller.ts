import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { AppRole } from '@app/role/enums/app-role.enum';
import { RoleGuard } from '@app/role/guards/role.guard';
import { JwtAuthGuard } from '@app/spa-authentication';
import { UserDto } from '@app/user/dtos/user.dto';
import { UserAuthForAdminService } from '@app/user-auth/services/user-auth-for-admin.service';
import { ChangePasswordForUserDto } from '@app/user-auth/dtos/for-admin/change-password-for-user.dto';
import { ApproveUserToJoinSystemDto } from '@app/user/dtos/for-admin/approve-user-to-join-system.dto';

@ApiExtraModels(ApiRiaDto, UserDto)
@UseGuards(JwtAuthGuard, RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
@ApiTags('Auth endpoints for admin')
@Controller('auth-for-admin')
export class UserAuthForAdminsController {
  constructor(
    private readonly userAuthForAdminService: UserAuthForAdminService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/change-user-password')
  async changePasswordForUser(
    @Body() changePasswordForUserDto: ChangePasswordForUserDto,
  ) {}

  @ApiRiaDto(UserDto)
  @Post('/approve-user')
  async approveUser(
    @Body() approveUserToJoinSystemDto: ApproveUserToJoinSystemDto,
  ) {
    return this.userAuthForAdminService.approveUserToJoinTheSystem(
      approveUserToJoinSystemDto,
    );
  }
  @ApiRiaDto(UserDto)
  @Post('/reject-user/:id')
  async rejectUser(@Param('id', ParseIntPipe) id: number) {
    return this.userAuthForAdminService.rejectUser(id);
  }
}

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
import { UserAuthForAdminService } from '../services';
import { ChangePasswordForUserDto } from '../dtos';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/spa';
import { AppRole, RoleGuard } from '@app/role';
import { ApiRiaDto } from '@app/shared';
import { UserDto } from '@app/user';

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
  @Post('/approve-user/:id')
  async approveUser(@Param('id', ParseIntPipe) id: number) {
    return this.userAuthForAdminService.approveUserToJoinTheSystem(id);
  }
  @ApiRiaDto(UserDto)
  @Post('/reject-user/:id')
  async rejectUser(@Param('id', ParseIntPipe) id: number) {
    return this.userAuthForAdminService.rejectUser(id);
  }
}

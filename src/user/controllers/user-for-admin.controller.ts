import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PatchUserDto, UpdateUserDto } from '@app/user/dtos/update-user.dto';
import { UserDto } from '@app/user/dtos/user.dto';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';
import { JwtAuthGuard, RequestUser } from '@app/spa-authentication';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { UserService } from '@app/user/services/user.service';
import { UserForAdminService } from '@app/user/services/user-for-admin.service';
import { User } from '@app/user/models/user.model';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { FindSystemUsersDto } from '@app/user/dtos/for-admin/find-system-users.dto';
import { ReceiptDto } from '@app/departments/financial/dtos/receipt/receipt.dto';
import { AssignJobToUserDto } from '@app/user/dtos/for-admin/assign-job-to-user.dto';

@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto, ReceiptDto)
@ApiTags(`Users' endpoints for admin`)
@UseGuards(
  JwtAuthGuard,
  RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER),
)
@Controller('users/for-admin')
export class UserForAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly userForAdminService: UserForAdminService,
  ) {}

  @ApiRiaDto(UserDto)
  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne({
      where: {
        id,
      },
    });
  }

  @ApiPaginatedDto(UserDto)
  @Get()
  getSystemUsers(
    @RequestUser() admin: User,
    @Query() findSystemUsersDto: FindSystemUsersDto,
  ) {
    return this.userForAdminService.findSystemUsers(admin, findSystemUsersDto);
  }

  @ApiRiaDto(UserDto)
  @Patch(':id/assign-job')
  assignJobToUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignJobToUserDto: AssignJobToUserDto,
  ) {
    return this.userForAdminService.assignJobToUser(id, assignJobToUserDto);
  }

  @ApiRiaDto(UserDto)
  @Patch(':id')
  patchUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
  ) {
    return this.userService.patchOne(id, patchUserDto);
  }

  @ApiRiaDto(UserDto)
  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateOne(
      {
        where: {
          id,
        },
      },
      updateUserDto,
    );
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services';
import {
  CreateUserDto,
  FindSystemUsersDto,
  UpdateUserDto,
  UserDto,
} from '../dtos';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RequestUser } from '@app/spa';
import { User } from '@app/user';
import { UserForAdminService } from '../services/user-for-admin.service';
import { AppRole, RoleGuard } from '@app/role';

@UseGuards(JwtAuthGuard, RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto)
@ApiTags(`Users' endpoints for admin`)
@Controller('user/for-admin')
export class UserForAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly userForAdminService: UserForAdminService,
  ) {}

  @ApiPaginatedDto(UserDto)
  @Get()
  getSystemUsers(
    @RequestUser() admin: User,
    @Query() findSystemUsersDto: FindSystemUsersDto,
  ) {
    return this.userForAdminService.findSystemUsers(admin, findSystemUsersDto);
  }
  @ApiRiaDto(UserDto)
  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne({
      where: {
        id,
      },
    });
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

import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';
import { ApiRiaDto } from '@app/shared';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { User } from '@app/user';
import { JwtAuthGuard, RequestUser } from '@app/spa';
import { AppRole, RoleGuard } from '@app/role';

@UseGuards(
  JwtAuthGuard,
  RoleGuard(
    AppRole.SUPER_ADMIN,
    AppRole.ADMIN,
    AppRole.HR_MANAGER,
    AppRole.MANAGER,
    AppRole.USER,
  ),
)
@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto)
@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiRiaDto(UserDto)
  @Get('me')
  getMe(@RequestUser() user: User) {
    return { data: user };
  }
  @ApiRiaDto(UserDto)
  @Put('me')
  updateUser(@RequestUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(
      {
        where: {
          id: user.id,
        },
      },
      updateUserDto,
    );
  }
}

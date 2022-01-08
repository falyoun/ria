import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';
import { ApiRiaDto } from '@app/shared';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { User } from '@app/user';
import { RequestUser } from '@app/spa';
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

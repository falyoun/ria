import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RequestUser } from '@app/spa-authentication';
import { UpdateUserDto } from '@app/user/dtos/update-user.dto';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';
import { UserDto } from '@app/user/dtos/user.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { UserService } from '@app/user/services/user.service';
import { ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { User } from '@app/user/models/user.model';
import { ReceiptDto } from '@app/departments/financial/dtos/receipt/receipt.dto';

@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto, ReceiptDto)
@ApiTags('Users')
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
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiRiaDto(UserDto)
  @Get('me')
  getMe(@RequestUser() user: User) {
    return user;
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

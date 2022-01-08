import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { User } from '@app/user';
import { JwtAuthGuard, RequestUser } from '@app/spa';
import { AppRole, RoleGuard } from '@app/role';
import {
  FindAllReceiptDto,
  ReceiptDto,
  ReceiptService,
} from '@app/departments';

@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto, ReceiptDto)
@ApiTags('User')
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
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly receiptService: ReceiptService,
  ) {}
  @ApiRiaDto(UserDto)
  @Get('me')
  getMe(@RequestUser() user: User) {
    return user;
  }

  @ApiPaginatedDto(ReceiptDto)
  @Get('my-receipts')
  getUsersReceipts(
    @RequestUser() user: User,
    @Query() findAllReceiptDto: FindAllReceiptDto,
  ) {
    return this.receiptService.findAllReceipts({
      ...findAllReceiptDto,
      email: user.email,
    });
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

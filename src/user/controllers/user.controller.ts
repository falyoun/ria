import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  FindAllReceiptDto,
  ReceiptDto,
  ReceiptService,
} from '@app/departments';
import { JwtAuthGuard, RequestUser } from '@app/spa-authentication';
import { UpdateUserDto } from '@app/user/dtos/update-user.dto';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';
import { UserDto } from '@app/user/dtos/user.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { UserService } from '@app/user/services/user.service';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { User } from '@app/user/models/user.model';

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

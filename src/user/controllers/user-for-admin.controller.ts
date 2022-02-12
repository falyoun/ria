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
import { UserService, UserForAdminService } from '../services';
import { AppRole, RoleGuard } from '@app/role';
import {
  FindAllReceiptDto,
  ReceiptDto,
  ReceiptService,
} from '@app/departments';

@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto, ReceiptDto)
@ApiTags(`Users' endpoints for admin`)
@UseGuards(JwtAuthGuard, RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
@Controller('users/for-admin')
export class UserForAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly userForAdminService: UserForAdminService,
    private readonly receiptService: ReceiptService,
  ) {}

  @ApiPaginatedDto(ReceiptDto)
  @Get('all-receipts')
  getUsersReceipts(
    @RequestUser() admin: User,
    @Query() findAllReceiptDto: FindAllReceiptDto,
  ) {
    return this.receiptService.findAllReceipts(findAllReceiptDto);
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

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';
import {
  CreateReceiptDto,
  ReceiptDto,
  ReceiptService,
  RequestNewReceipt,
} from '@app/departments';
import { JwtAuthGuard, RequestUser } from '@app/spa';
import { AppRole, RoleGuard } from '@app/role';
import { UserService } from '../services';
import { User } from '../models';
@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto, ReceiptDto)
@ApiTags(`Users' financial endpoints`)
@UseGuards(
  JwtAuthGuard,
  RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER),
)
@Controller('/users/financial')
export class UserFinancialController {
  constructor(
    private readonly receiptService: ReceiptService,
    private readonly userService: UserService,
  ) {}
  @UseGuards(
    JwtAuthGuard,
    RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER),
  )
  @Post('/receipt')
  async createReceipt(
    @RequestUser() admin: User,
    @Body() requestNewReceipt: RequestNewReceipt,
  ) {
    const user = await this.userService.findOne({
      where: {
        id: requestNewReceipt.userId,
      },
    });
    return this.receiptService.createOne(
      user,
      <CreateReceiptDto>requestNewReceipt,
    );
  }
}

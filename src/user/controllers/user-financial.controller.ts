import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  CreateReceiptDto,
  ReceiptDto,
  ReceiptService,
  RequestNewReceipt,
} from '@app/departments';
import { UserDto } from '@app/user/dtos/user.dto';
import { UpdateUserDto } from '@app/user/dtos/update-user.dto';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';
import { JwtAuthGuard, RequestUser } from '@app/spa-authentication';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { UserService } from '@app/user/services/user.service';
import { User } from '@app/user/models/user.model';
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

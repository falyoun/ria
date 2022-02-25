import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserDto } from '@app/user/dtos/user.dto';
import { UpdateUserDto } from '@app/user/dtos/update-user.dto';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';
import { JwtAuthGuard, RequestUser } from '@app/spa-authentication';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { User } from '@app/user/models/user.model';
import { ReceiptDto } from '@app/departments/financial/dtos/receipt/receipt.dto';
import { ReceiptService } from '@app/departments/financial/services/receipt.service';
import { RequestNewReceipt } from '@app/departments/financial/dtos/receipt/create-receipt.dto';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { FindAllReceiptDto } from '@app/departments/financial/dtos/receipt/find-all-receipt.dto';
import { Salary } from '@app/departments/financial/models/salary.model';
import { Deduction } from '@app/departments/financial/models/deduction.model';

@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto, ReceiptDto)
@ApiTags(`Financial`)
@Controller('/financial/receipts')
export class ReceiptsController {
  constructor(private readonly receiptService: ReceiptService) {}
  @UseGuards(
    JwtAuthGuard,
    RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER),
  )
  @ApiRiaDto(ReceiptDto)
  @Post()
  async createReceipt(
    @RequestUser() admin: User,
    @Body() requestNewReceipt: RequestNewReceipt,
  ) {
    return this.receiptService.createOne(admin, requestNewReceipt);
  }

  @UseGuards(
    JwtAuthGuard,
    RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER),
  )
  @ApiRiaDto(ReceiptDto)
  @Delete(':id')
  async deleteReceipt(
    @RequestUser() admin: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.receiptService.deleteOne({
      where: {
        id,
      },
    });
  }

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
  @ApiRiaDto(ReceiptDto)
  @Get(':id')
  getReceiptById(
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) receiptId: number,
  ) {
    return this.receiptService.findOne({
      where: {
        // userId: user.id,
        id: receiptId,
      },
      include: [
        {
          model: Salary,
        },
        {
          model: Deduction,
        },
      ],
    });
  }
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
  @ApiPaginatedDto(ReceiptDto)
  @Get()
  getMyReceipts(
    @RequestUser() user: User,
    @Query() findAllReceiptDto: FindAllReceiptDto,
  ) {
    return this.receiptService.findAllReceipts({
      ...findAllReceiptDto,
      email: user.email,
    });
  }

  @UseGuards(
    JwtAuthGuard,
    RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER),
  )
  @ApiPaginatedDto(ReceiptDto)
  @Get('/all/for-admin')
  getUsersReceipts(
    @RequestUser() admin: User,
    @Query() findAllReceiptDto: FindAllReceiptDto,
  ) {
    return this.receiptService.findAllReceipts(findAllReceiptDto);
  }
}

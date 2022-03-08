import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { UpdateReceiptDto } from '@app/departments/financial/dtos/receipt/update-receipt.dto';
import { UpdateDeductionDto } from '@app/departments/financial/dtos/deduction/update-deduction.dto';
import { DeductionService } from '@app/departments/financial/services/deduction.service';
import { SalaryService } from '@app/departments/financial/services/salary.service';
import { UpdateSalaryDto } from '@app/departments/financial/dtos/salary/update-salary.dto';
import { DeleteManyDeductionsDto } from '@app/departments/financial/dtos/deduction/delete-many-deductions.dto';
import { Op } from 'sequelize';
import { DeleteManySalariesDto } from '@app/departments/financial/dtos/salary/delete-many-salaries.dto';
import { DeleteManyReceiptsDto } from '@app/departments/financial/dtos/receipt/delete-many-receipts.dto';

@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto, ReceiptDto)
@ApiTags(`Financial`)
@Controller('/financial/receipts')
export class ReceiptsController {
  constructor(
    private readonly receiptService: ReceiptService,
    private readonly deductionsService: DeductionService,
    private readonly salariesService: SalaryService,
  ) {}
  @UseGuards(
    JwtAuthGuard,
    RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER),
  )
  @ApiRiaDto(ReceiptDto)
  @Post()
  createReceipt(
    @RequestUser() admin: User,
    @Body() requestNewReceipt: RequestNewReceipt,
  ) {
    return this.receiptService.createOne(admin, requestNewReceipt);
  }

  @Put(':receiptId/deductions/:id')
  updateDeduction(
    @Param('receiptId', ParseIntPipe) receiptId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeductionDto: UpdateDeductionDto,
  ) {
    return this.deductionsService.updateOne(receiptId, id, updateDeductionDto);
  }
  @Delete(':receiptId/deductions/:id')
  deleteDeduction(
    @Param('receiptId', ParseIntPipe) receiptId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.deductionsService.deleteOne(
      {
        where: {
          id,
          receiptId,
        },
      },
      {
        force: true,
      },
    );
  }
  @Delete(':receiptId/deductions')
  deleteMultipleDeduction(
    @Param('receiptId', ParseIntPipe) receiptId: number,
    @Body() deleteManyDeductionsDto: DeleteManyDeductionsDto,
  ) {
    return this.deductionsService.deleteMany(
      {
        where: {
          id: {
            [Op.in]: deleteManyDeductionsDto.ids,
          },
          receiptId,
        },
      },
      {
        force: true,
      },
    );
  }

  @Put(':receiptId/salaries/:id')
  updateSalary(
    @Param('receiptId', ParseIntPipe) receiptId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalaryDto: UpdateSalaryDto,
  ) {
    return this.salariesService.updateOne(receiptId, id, updateSalaryDto);
  }

  @Delete(':receiptId/salaries')
  deleteManySalaries(
    @Param('receiptId', ParseIntPipe) receiptId: number,
    @Body() deleteManySalariesDto: DeleteManySalariesDto,
  ) {
    return this.salariesService.deleteMany(
      {
        where: {
          id: {
            [Op.in]: deleteManySalariesDto.ids,
          },
          receiptId,
        },
      },
      {
        force: true,
      },
    );
  }

  @Delete(':receiptId/salaries/:id')
  deleteSalary(
    @Param('receiptId', ParseIntPipe) receiptId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.salariesService.deleteOne(
      {
        where: {
          id,
          receiptId,
        },
      },
      {
        force: true,
      },
    );
  }

  @Put(':id')
  updateReceipt(
    @Body() body: UpdateReceiptDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.receiptService.updateOne(id, body);
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
    return this.receiptService.deleteOne(
      {
        where: {
          id,
        },
      },
      {
        force: true,
      },
    );
  }
  @Delete()
  async deleteManyReceipt(
    @Body() deleteManyReceiptsDto: DeleteManyReceiptsDto,
  ) {
    return this.receiptService.deleteManyReceipts(
      {
        where: {
          id: {
            [Op.in]: deleteManyReceiptsDto.ids,
          },
        },
      },
      {
        force: true,
      },
    );
  }
  @UseGuards(
    JwtAuthGuard,
    RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER),
  )
  @ApiPaginatedDto(ReceiptDto)
  @Get('/by-admin')
  getUsersReceipts(
    @RequestUser() admin: User,
    @Query() findAllReceiptDto: FindAllReceiptDto,
  ) {
    return this.receiptService.findAllReceipts(findAllReceiptDto);
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
        {
          model: User
        }
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
}

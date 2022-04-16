import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InvoiceFlowService } from '@app/invoice/services/invoice-flow.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from '@app/invoice/dtos/invoice.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { RequestUser } from '@app/spa-authentication';
import { User } from '@app/user/models/user.model';
import { UnAssignInvoiceFormUserDto } from '@app/invoice/dtos/invoice-flow-dtos/un-assign-invoice-form-user.dto';
import { AssignInvoiceToUserDto } from '@app/invoice/dtos/invoice-flow-dtos/assign-invoice-to-user.dto';
import { ApiRiaDto } from '@app/shared/dtos/ria-response.dto';

@UseGuards(RoleGuard(AppRole.MANAGER, AppRole.ADMIN, AppRole.SUPER_ADMIN))
@ApiExtraModels(InvoiceDto)
@Controller('/invoices/flow')
@ApiTags('Invoice Flow')
export class InvoiceFlowController {
  constructor(private readonly invoiceFlowService: InvoiceFlowService) {}

  @ApiRiaDto(InvoiceDto)
  @Post(':id/assign-to-user')
  assignInvoiceToUser(
    @Param('id', ParseIntPipe) id: number,
    @RequestUser() user: User,
    @Body() assignInvoiceToUserDto: AssignInvoiceToUserDto,
  ) {
    return this.invoiceFlowService.assignInvoiceToUser(
      id,
      assignInvoiceToUserDto,
    );
  }

  @ApiRiaDto(InvoiceDto)
  @Post(':id/un-assign-from-user')
  unAssignInvoiceFromUser(
    @Param('id', ParseIntPipe) id: number,
    @RequestUser() user: User,
    @Body() unAssignInvoiceFromUserDto: UnAssignInvoiceFormUserDto,
  ) {
    return this.invoiceFlowService.unAssignInvoiceFromUser(
      id,
      unAssignInvoiceFromUserDto,
    );
  }

  @ApiRiaDto(InvoiceDto)
  @Post(':id/review')
  reviewOne(@Param('id', ParseIntPipe) id: number, @RequestUser() user: User) {
    return this.invoiceFlowService.reviewInvoice(id, user);
  }

  @ApiRiaDto(InvoiceDto)
  @Post(':id/approve')
  approveOne(@Param('id', ParseIntPipe) id: number, @RequestUser() user: User) {
    return this.invoiceFlowService.approveInvoice(id, user);
  }

  @ApiRiaDto(InvoiceDto)
  @Post(':id/reject')
  rejectInvoice(
    @Param('id', ParseIntPipe) id: number,
    @RequestUser() user: User,
  ) {
    return this.invoiceFlowService.rejectInvoice(id, user);
  }

  @ApiRiaDto(InvoiceDto)
  @Post(':id/mark-as-paid')
  markInvoiceAsPaid(
    @Param('id', ParseIntPipe) id: number,
    @RequestUser() user: User,
  ) {
    return this.invoiceFlowService.markInvoiceAsPaid(id, user);
  }
}

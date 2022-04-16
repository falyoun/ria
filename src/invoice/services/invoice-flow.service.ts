import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '@app/invoice/invoice.model';
import { InvoiceCrudService } from '@app/invoice/services/invoice-crud.service';
import { User } from '@app/user/models/user.model';
import { AssignInvoiceToUserDto } from '@app/invoice/dtos/invoice-flow-dtos/assign-invoice-to-user.dto';
import { UserService } from '@app/user/services/user.service';
import { UnAssignInvoiceFormUserDto } from '@app/invoice/dtos/invoice-flow-dtos/un-assign-invoice-form-user.dto';
import { InvoiceStatusEnum } from '@app/invoice/enums/invoice-status.enum';

@Injectable()
export class InvoiceFlowService {
  constructor(
    @InjectModel(Invoice) private readonly invoiceModel: typeof Invoice,
    private readonly invoiceCrudService: InvoiceCrudService,
    private readonly userService: UserService,
  ) {}

  async assignInvoiceToUser(
    id: number,
    assignInvoiceToUserDto: AssignInvoiceToUserDto,
  ) {
    const user = await this.userService.findOne({
      where: {
        id: assignInvoiceToUserDto.userId,
      },
    });
    const invoice = await this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
    await invoice.update({
      assigneeId: user.id,
    });
    return this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
  }

  async unAssignInvoiceFromUser(
    id: number,
    unAssignInvoiceToUserDto: UnAssignInvoiceFormUserDto,
  ) {
    await this.userService.findOne({
      where: {
        id: unAssignInvoiceToUserDto.userId,
      },
    });
    const invoice = await this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
    await invoice.update({
      assigneeId: null,
    });
    return this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
  }

  async markInvoiceAsPaid(id: number, user: User) {
    const invoice = await this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
    await invoice.update({
      paidById: user.id,
      status: InvoiceStatusEnum.COMPLETED,
    });
    return this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
  }
  async rejectInvoice(id: number, user: User) {
    const invoice = await this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
    await invoice.update({
      rejectedById: user.id,
      status: InvoiceStatusEnum.REJECTED,
    });
    return this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
  }
  async reviewInvoice(id: number, reviewer: User) {
    const invoice = await this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
    await invoice.update({
      reviewedById: reviewer.id,
      status: InvoiceStatusEnum.APPROVAL_PENDING,
    });
    return this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
  }

  async approveInvoice(id: number, approval: User) {
    const invoice = await this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
    await invoice.update({
      approvedById: approval.id,
      status: InvoiceStatusEnum.PAYMENT_PENDING,
    });
    return this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '@app/invoice/invoice.model';
import { InvoiceCrudService } from '@app/invoice/services/invoice-crud.service';
import { User } from '@app/user/models/user.model';
import { AssignInvoiceToUserDto } from '@app/invoice/dtos/invoice-flow-dtos/assign-invoice-to-user.dto';
import { UserService } from '@app/user/services/user.service';
import { UnAssignInvoiceFormUserDto } from '@app/invoice/dtos/invoice-flow-dtos/un-assign-invoice-form-user.dto';

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
  async reviewInvoice(id: number, reviewer: User) {
    const invoice = await this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
    await invoice.update({
      reviewedById: reviewer.id,
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
    });
    return this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
  }
}

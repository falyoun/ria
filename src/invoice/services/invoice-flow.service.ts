import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '@app/invoice/invoice.model';
import { InvoiceCrudService } from '@app/invoice/services/invoice-crud.service';
import { User } from '@app/user/models/user.model';
import { AssignInvoiceToUserDto } from '@app/invoice/dtos/invoice-flow-dtos/assign-invoice-to-user.dto';
import { UserService } from '@app/user/services/user.service';
import { UnAssignInvoiceFormUserDto } from '@app/invoice/dtos/invoice-flow-dtos/un-assign-invoice-form-user.dto';
import { InvoiceStatusEnum } from '@app/invoice/enums/invoice-status.enum';
import { InvoiceDto } from '@app/invoice/dtos/invoice.dto';
import {
  Beneficiary,
  BeneficiaryTypeEnum,
} from '@app/beneficiary/models/beneficiary.model';
import { BeneficiaryService } from '@app/beneficiary/services/beneficiary.service';
import { BeneficiaryDto } from '@app/beneficiary/dtos/beneficiary.dto';
import { CreateBeneficiaryDto } from '@app/beneficiary/dtos/create-beneficiary.dto';

@Injectable()
export class InvoiceFlowService {
  constructor(
    @InjectModel(Invoice) private readonly invoiceModel: typeof Invoice,
    private readonly invoiceCrudService: InvoiceCrudService,
    private readonly userService: UserService,
    private readonly beneficiaryService: BeneficiaryService,
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
  async reviewInvoice(id: number, reviewer: User, invoiceDto: InvoiceDto) {
    console.log(invoiceDto);
    const invoice = await this.invoiceCrudService.findOne({
      where: {
        id,
      },
    });
    const dataBoxes = invoiceDto?.dataBoxes || [];
    const beneficiaryDto: CreateBeneficiaryDto = {};
    let foundBeneficiary: Beneficiary;
    if (
      invoiceDto?.beneficiary?.iban ||
      dataBoxes.some((ele) => ele.key === 'iban')
    ) {
      beneficiaryDto.iban =
        invoiceDto?.beneficiary?.iban ||
        dataBoxes.filter((ele) => ele.key === 'iban')[0].value;
      foundBeneficiary = await this.beneficiaryService.findOne({
        iban: beneficiaryDto.iban,
      });
    }

    console.log('foundBeneficiary: ', foundBeneficiary);
    if (
      invoice?.beneficiary?.swiftCode ||
      dataBoxes.some((ele) => ele.key === 'swift_code')
    ) {
      beneficiaryDto.swiftCode =
        invoice?.beneficiary?.swiftCode ||
        dataBoxes.filter((ele) => ele.key === 'swift_code')[0].value;
    }

    if (
      invoice?.beneficiary?.accountNumber ||
      dataBoxes.some((ele) => ele.key === 'account_number')
    ) {
      beneficiaryDto.accountNumber =
        invoice?.beneficiary?.accountNumber ||
        dataBoxes.filter((ele) => ele.key === 'account_number')[0].value;
    }

    if (
      invoice?.beneficiary?.bankName ||
      dataBoxes.some((ele) => ele.key === 'bank_name')
    ) {
      beneficiaryDto.bankName =
        invoice?.beneficiary?.bankName ||
        dataBoxes.filter((ele) => ele.key === 'bank_name')[0].value;
    }

    if (
      invoice?.beneficiary?.name ||
      dataBoxes.some((ele) => ele.key === 'bill_to')
    ) {
      beneficiaryDto.name =
        invoice?.beneficiary?.name ||
        dataBoxes.filter((ele) => ele.key === 'bill_to')[0].value;
    }

    if (foundBeneficiary) {
      await foundBeneficiary.update(beneficiaryDto);
      // await invoice.update({
      //   beneficiaryId: foundBeneficiary.id,
      // });
    } else {
      console.log(beneficiaryDto);
      const beneficiary = await this.beneficiaryService.createBeneficiary(
        beneficiaryDto,
      );
      await invoice.update({
        beneficiaryId: beneficiary.id,
      });
    }
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

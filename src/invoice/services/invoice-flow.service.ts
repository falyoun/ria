import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '@app/invoice/invoice.model';
import { CreateInvoiceDto } from '@app/invoice/dtos/invoice-crud-dtos/create-invoice.dto';
import { FindOptions, InstanceDestroyOptions } from 'sequelize';
import { InvoiceNotFoundException } from '@app/invoice/exceptions';
import { PatchInvoiceDto } from '@app/invoice/dtos/invoice-crud-dtos/patch-invoice.dto';
import { GetManyInvoicesDto } from '@app/invoice/dtos/invoice-crud-dtos/get-many-invoices.dto';
import { RiaUtils } from '@app/shared/utils';

@Injectable()
export class InvoiceFlowService {
  constructor(
    @InjectModel(Invoice) private readonly invoiceModel: typeof Invoice,
  ) {}
  createOne(createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceModel.create(createInvoiceDto);
  }
  async findOne(findOptions: FindOptions<Invoice>) {
    const instance = await this.invoiceModel.findOne(findOptions);
    if (!instance) {
      throw new InvoiceNotFoundException();
    }
    return instance;
  }
  async patchInvoice(id: number, patchInvoiceDto: PatchInvoiceDto) {
    const invoice = await this.findOne({
      where: {
        id,
      },
    });
  }
  async findAll(getManyInvoicesDto: GetManyInvoicesDto) {
    const findOptions: FindOptions<Invoice> = {};
    const count = await this.invoiceModel.count(findOptions);
    RiaUtils.applyPagination(findOptions, getManyInvoicesDto);
    return {
      data: await this.invoiceModel.findAll(findOptions),
      count,
    };
  }
  async updateInvoice(id: number, patchInvoiceDto: PatchInvoiceDto) {
    const invoice = await this.findOne({
      where: {
        id,
      },
    });
  }

  async deleteOne(id: number, instanceDestroyOptions?: InstanceDestroyOptions) {
    const invoice = await this.findOne({
      where: {
        id,
      },
    });
    await invoice.destroy(instanceDestroyOptions);
  }
}

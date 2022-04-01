import { Injectable } from '@nestjs/common';
import { AppFileService } from '@app/global/app-file/services/app-file.service';
import { Invoice } from '@app/invoice/invoice.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@app/user/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';
import { ResourceNotFoundException } from '@app/shared/exceptions/coded-exception';
import { GetManyInvoicesDto } from '@app/invoice/dtos/invoice-crud-dtos/get-many-invoices.dto';
import { RiaUtils } from '@app/shared/utils';

@Injectable()
export class InvoiceCrudService {
  constructor(
    @InjectModel(Invoice)
    private readonly invoiceModel: typeof Invoice,
    private readonly appFileService: AppFileService,
    private readonly sequelize: Sequelize,
  ) {}

  async createOne(user: User, file: Express.Multer.File) {
    return this.sequelize.transaction(async (transaction) => {
      const createdFile = await this.appFileService.createFile({
        mimetype: file.mimetype,
        path: file.path,
        filename: file.filename,
      });
      return this.invoiceModel.create({
        submittedById: user.id,
        fileId: createdFile.id,
      });
    });
  }

  async findOne(findOptions: FindOptions<Invoice>) {
    const instance = await this.invoiceModel.findOne(findOptions);
    if (!instance) {
      throw new ResourceNotFoundException('INVOICE');
    }
    return instance;
  }

  async findAll(findInvoicesDto: GetManyInvoicesDto) {
    const findOptions: FindOptions<Invoice> = {};
    const count = await this.invoiceModel.count(findOptions);
    RiaUtils.applyPagination(findOptions, findInvoicesDto);
    return {
      data: await this.invoiceModel.findAll(findOptions),
      count,
    };
  }
}

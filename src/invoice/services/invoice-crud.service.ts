import { Injectable } from '@nestjs/common';
import { AppFileService } from '@app/global/app-file/services/app-file.service';
import { Invoice } from '@app/invoice/invoice.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@app/user/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { FindOptions, InstanceDestroyOptions } from 'sequelize';
import { ResourceNotFoundException } from '@app/shared/exceptions/coded-exception';
import { GetManyInvoicesDto } from '@app/invoice/dtos/invoice-crud-dtos/get-many-invoices.dto';
import { RiaUtils } from '@app/shared/utils';
import { CreateInvoiceDto } from '@app/invoice/dtos/invoice-crud-dtos/create-invoice.dto';
import { ScopeOptions } from 'sequelize/dist/lib/model';
import { InvoiceStatusEnum } from '@app/invoice/enums/invoice-status.enum';
import { AppFile } from '@app/global/app-file/models/app-file.model';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class InvoiceCrudService {
  constructor(
    @InjectModel(Invoice)
    private readonly invoiceModel: typeof Invoice,
    private readonly appFileService: AppFileService,
    private readonly sequelize: Sequelize,
  ) {}

  async createOne(
    user: User,
    file: Express.Multer.File,
    createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.sequelize.transaction(async (transaction) => {
      const createdFile = await this.appFileService.createFile({
        mimetype: file.mimetype,
        path: file.path,
        filename: file.filename,
      });
      const instance = await this.invoiceModel.create({
        ...createInvoiceDto,
        submittedById: user.id,
        fileId: createdFile.id,
        status: InvoiceStatusEnum.REVIEW_PENDING,
      });
      return this.findOne({
        where: {
          id: instance.id,
        },
        include: [AppFile],
      });
    });
  }

  retrieveInvoicesNames() {
    return fs.readdirSync(join(__dirname, '../../..', 'public/invoices-files'));
  }

  async findOne(
    findOptions: FindOptions<Invoice>,
    scopesOptions:
      | string
      | ScopeOptions
      | readonly (string | ScopeOptions)[] = 'all-users',
  ) {
    const instance = await this.invoiceModel
      .scope(scopesOptions)
      .findOne(findOptions);
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
      data: await this.invoiceModel.scope('all-users').findAll(findOptions),
      count,
    };
  }

  async deleteOne(id: number, instanceDestroyOptions?: InstanceDestroyOptions) {
    const invoice = await this.findOne({
      where: {
        id,
      },
    });
    await invoice.destroy(instanceDestroyOptions);
    return {
      message: 'deleted.!',
    };
  }
}

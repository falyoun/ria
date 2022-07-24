import { Injectable } from '@nestjs/common';
import { AppFileService } from '@app/global/app-file/services/app-file.service';
import { Invoice } from '@app/invoice/invoice.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@app/user/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { FindOptions, InstanceDestroyOptions, ScopeOptions } from 'sequelize';
import { ResourceNotFoundException } from '@app/shared/exceptions/coded-exception';
import { GetManyInvoicesDto } from '@app/invoice/dtos/invoice-crud-dtos/get-many-invoices.dto';
import { RiaUtils } from '@app/shared/utils';
import { CreateInvoiceDto } from '@app/invoice/dtos/invoice-crud-dtos/create-invoice.dto';
import { InvoiceStatusEnum } from '@app/invoice/enums/invoice-status.enum';
import { AppFile } from '@app/global/app-file/models/app-file.model';
import * as fs from 'fs';
import { join } from 'path';

import * as tesseract from 'node-tesseract-ocr';
import { fromPath } from 'pdf2pic';

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
    const config = {
      lang: 'eng',
    };
    console.log(join(__dirname, '/images'));
    const options = {
      density: 200,
      saveFilename: file.filename.split('.')[0],
      savePath: join(__dirname, '../../../', 'public/tmp-images'),
      format: 'png',
      width: 800,
      height: 800,
    };
    const storeAsImage = fromPath(file.path, options);

    storeAsImage()
      .then(async (res) => {
        console.log('image: ', res);
        await tesseract
          .recognize(res['path'], config)
          .then((text) => {
            console.log('Result:', text);
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              console.log('l: ', line);
              const normalizedLine = line
                .replace(/[^\w\/]|_/g, '')
                .toLocaleLowerCase();

              const billToStr = 'billto';
              const billToIdx = normalizedLine.indexOf(billToStr);
              if (billToIdx !== -1) {
                const billTo = lines[i + 1].trim();
                console.log('billTo: ', billTo);
              }

              const ibanStr = 'iban';
              const ibanIdx = normalizedLine.indexOf(ibanStr);
              if (ibanIdx !== -1) {
                const start = ibanIdx + ibanStr.length;
                const end = start + 23;
                const iban = normalizedLine.substring(start, end).toUpperCase();
                console.log('iban: ', iban);
              }
              const paymentDueDateStr = 'paymentisdueon';
              const paymentDueDateIdx =
                normalizedLine.indexOf(paymentDueDateStr);
              if (paymentDueDateIdx !== -1) {
                const dueDate = normalizedLine.substring(
                  paymentDueDateIdx + paymentDueDateStr.length,
                );
                console.log('dueDate: ', dueDate);
              }
              const swiftCodeStr = 'swiftcode';
              const swiftIdx = normalizedLine.indexOf(swiftCodeStr);
              if (swiftIdx !== -1) {
                const start = swiftIdx + swiftCodeStr.length;
                const end = start + 11;
                const swiftCode = normalizedLine
                  .substring(start, end)
                  .toUpperCase();
                console.log('swiftCode: ', swiftCode);
              }
            }
            fs.writeFileSync(
              join(__dirname, '../../../', 'public/tmp-data/') +
                file.filename.split('.')[0] +
                '.txt',
              text,
            );
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((err) => {
        console.log('err: ', err);
      });

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

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
import { DataBox } from '@app/invoice/data-box.model';
import { CreateDataBoxDto } from '@app/invoice/dtos/invoice-crud-dtos/data-box.dto';
import { BeneficiaryTypeEnum } from '@app/beneficiary/models/beneficiary.model';
import { BeneficiaryService } from '@app/beneficiary/services/beneficiary.service';
import { InvoiceGateway } from '@app/invoice/gateways/invoice-socket.gateway';
import { CallQueue } from '@app/invoice/services/call-queue';

@Injectable()
export class InvoiceCrudService {
  callQueue: CallQueue;
  constructor(
    @InjectModel(Invoice)
    private readonly invoiceModel: typeof Invoice,
    @InjectModel(DataBox)
    private readonly dataBoxModel: typeof DataBox,
    private readonly appFileService: AppFileService,
    private readonly sequelize: Sequelize,
    private readonly beneficiaryService: BeneficiaryService,
    private readonly invoiceSocketGateway: InvoiceGateway,
  ) {
    this.callQueue = new CallQueue();
  }

  async analyzeInvoice(
    invoice: Invoice,
    invoiceFile: Express.Multer.File,
    user: User,
  ) {
    const p = new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 5000);
    });
    await p;
    try {
      const config = {
        lang: 'eng',
      };
      const options = {
        density: 200,
        saveFilename: invoiceFile.filename.split('.')[0],
        savePath: join(__dirname, '../../../', 'public/tmp-images'),
        format: 'png',
        width: 800,
        height: 800,
      };
      const storeAsImage = fromPath(invoiceFile.path, options);
      const dataBoxes = await storeAsImage()
        .then(async (res) => {
          console.log('image: ', res);
          return tesseract.recognize(res['path'], config);
        })
        .then((text) => {
          const boxes: CreateDataBoxDto[] = [];
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
              boxes.push({
                key: 'bill_to',
                value: billTo,
              });
            }

            const ibanStr = 'iban';
            const ibanIdx = normalizedLine.indexOf(ibanStr);
            if (ibanIdx !== -1) {
              const start = ibanIdx + ibanStr.length;
              const end = start + 23;
              const iban = normalizedLine.substring(start, end).toUpperCase();
              console.log('iban: ', iban);
              boxes.push({
                key: ibanStr,
                value: iban,
              });
            }
            const paymentDueDateStr = 'paymentisdueon';
            const paymentDueDateIdx = normalizedLine.indexOf(paymentDueDateStr);
            if (paymentDueDateIdx !== -1) {
              const dueDate = normalizedLine.substring(
                paymentDueDateIdx + paymentDueDateStr.length,
              );
              console.log('dueDate: ', dueDate);
              boxes.push({
                key: 'payment_due_date',
                value: dueDate,
              });
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

              boxes.push({
                key: 'swift_code',
                value: swiftCode,
              });
            }
          }
          fs.writeFileSync(
            join(__dirname, '../../../', 'public/tmp-data/') +
              invoiceFile.filename.split('.')[0] +
              '.txt',
            text,
          );

          this.invoiceSocketGateway.emitInvoiceStatusChanged({
            invoiceId: invoice.id,
            status: InvoiceStatusEnum.REVIEW_PENDING,
            userId: user.id,
          });
          return boxes;
        })
        .catch((err) => {
          console.log('err: ', err);
        });

      console.log('dataBoxes after call-queue: ', dataBoxes);

      if (dataBoxes && dataBoxes.length > 0) {
        if (dataBoxes.some((ele) => ele.key === 'iban')) {
          const iban = dataBoxes.filter((ele) => ele.key === 'iban')[0].value;

          let swiftCode;
          if (dataBoxes.some((ele) => ele.key === 'swift_code')) {
            swiftCode = dataBoxes.filter((ele) => ele.key === 'swift_code')[0]
              .value;
          }
          let beneficiaryName;
          if (dataBoxes.some((ele) => ele.key === 'bill_to')) {
            beneficiaryName = dataBoxes.filter(
              (ele) => ele.key === 'bill_to',
            )[0].value;
          }
          const beneficiary = await this.beneficiaryService.createBeneficiary({
            name: beneficiaryName,
            swiftCode,
            bankName: 'ARAB BANK PLC',
            branchName: 'RAS AL KHAIMAH BRANCH',
            iban,
            type: BeneficiaryTypeEnum.LOCAL,
          });
          await invoice.update({
            beneficiaryId: beneficiary.id,
          });
        }
      }

      console.log('dataBoxes: ', dataBoxes);
      if (dataBoxes && dataBoxes.length > 0) {
        await Promise.all(
          dataBoxes.map((ele) =>
            this.dataBoxModel.create({ ...ele, invoiceId: invoice.id }),
          ),
        );
      }
      await invoice.update({
        status: InvoiceStatusEnum.REVIEW_PENDING,
      });
      await this.invoiceSocketGateway.emitInvoiceStatusChanged({
        invoiceId: invoice.id,
        status: InvoiceStatusEnum.REVIEW_PENDING,
        userId: user.id,
      });
    } catch (e) {
      console.log('error: ', e);
      await invoice.update({
        status: InvoiceStatusEnum.FAILED,
      });
      await this.invoiceSocketGateway.emitInvoiceStatusChanged({
        invoiceId: invoice.id,
        status: InvoiceStatusEnum.FAILED,
        userId: user.id,
      });
    }
  }

  reflectDataBoxesOnInvoice(
    invoice: any,
    dataBoxes: { key: string; value: string }[],
  ) {
    const isObject = (data) => typeof data === 'object' && data !== null;
    const reflectField = (invoice: any, key: string, value: string) => {
      for (const [invKey, invValue] of Object.entries(invoice)) {
        if (isObject(invValue)) reflectField(invValue, key, value);
        if (invKey === key) {
          invoice[invKey] = value;
          return;
        }
      }
    };
    dataBoxes.map(({ key, value }) => {
      reflectField(invoice, key, value);
    });
    return invoice;
  }
  async createOne(
    user: User,
    file: Express.Multer.File,
    createInvoiceDto: CreateInvoiceDto,
  ) {
    console.log(join(__dirname, '/images'));
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
        status: InvoiceStatusEnum.IN_ANALYZING_PROCESS,
      });

      this.callQueue.push(() => this.analyzeInvoice(instance, file, user));
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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { SalaryService } from './salary.service';
import { DeductionService } from './deduction.service';
import { Sequelize } from 'sequelize-typescript';
import { ReceiptNotFoundException } from '../exceptions';
import { User } from '@app/user/models/user.model';
import { RiaUtils } from '@app/shared/utils';
import {
  Receipt,
  ReceiptModelScopes,
} from '@app/departments/financial/models/receipt.model';
import { CreateReceiptDto } from '@app/departments/financial/dtos/receipt/create-receipt.dto';
import { FindAllReceiptDto } from '@app/departments/financial/dtos/receipt/find-all-receipt.dto';
import { Salary } from '@app/departments/financial/models/salary.model';
import { Deduction } from '@app/departments/financial/models/deduction.model';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Receipt) private readonly receiptModel: typeof Receipt,
    private readonly salaryService: SalaryService,
    private readonly deductionService: DeductionService,
    private readonly sequelize: Sequelize,
  ) {}
  async createOne(user: User, createReceiptDto: CreateReceiptDto) {
    return await this.sequelize.transaction(async (transaction) => {
      const createdReceipt = await this.receiptModel.create({
        userId: user.id,
      });
      const { salary } = createReceiptDto;
      await this.salaryService.createOne({
        ...salary,
        receiptId: createdReceipt.id,
      });
      if (createReceiptDto.deductions) {
        const { deductions } = createReceiptDto;
        await this.deductionService.bulkCreate(
          deductions.map((aDeduction) => ({
            ...aDeduction,
            receiptId: createdReceipt.id,
          })),
        );
      }
      return this.findOne({
        where: {
          id: createdReceipt.id,
        },
      });
    });
  }
  async findAllReceipts(findAllReceiptDto: FindAllReceiptDto) {
    let whereSalaryOptions: WhereOptions<Salary> = {};
    let whereUserOptions: WhereOptions<User> = {};
    if (findAllReceiptDto.email) {
      whereUserOptions = {
        ...whereUserOptions,
        email: {
          [Op.like]: `%${findAllReceiptDto.email}%`,
        },
      };
    }
    if (findAllReceiptDto.salaryLow && !findAllReceiptDto.salaryHigh) {
      whereSalaryOptions = {
        ...whereSalaryOptions,
        amount: {
          [Op.gte]: findAllReceiptDto.salaryLow,
        },
      };
    }
    if (findAllReceiptDto.salaryHigh && !findAllReceiptDto.salaryLow) {
      whereSalaryOptions = {
        ...whereSalaryOptions,
        amount: {
          [Op.lte]: findAllReceiptDto.salaryHigh,
        },
      };
    }
    if (findAllReceiptDto.salaryLow && findAllReceiptDto.salaryHigh) {
      whereSalaryOptions = {
        ...whereSalaryOptions,
        amount: {
          [Op.and]: [
            {
              [Op.gte]: findAllReceiptDto.salaryLow,
              [Op.lte]: findAllReceiptDto.salaryHigh,
            },
          ],
        },
      };
    }
    const findOptions: FindOptions<Receipt> = {
      include: [
        {
          model: User,
          where: whereUserOptions,
        },
        {
          model: Salary,
          where: whereSalaryOptions,
        },
        {
          model: Deduction,
        },
      ],
    };
    if (findAllReceiptDto.page || findAllReceiptDto.limit) {
      RiaUtils.applyPagination(findOptions, {
        page: findAllReceiptDto.page,
        limit: findAllReceiptDto.limit,
      });
    }
    return {
      data: await this.receiptModel.findAll(findOptions),
      count: await this.receiptModel.count(findOptions),
    };
  }
  async findOne(findOptions?: FindOptions<Receipt>) {
    const receipt = await this.receiptModel
      .scope(ReceiptModelScopes.JOIN_USER_SALARY_AND_DEDUCTIONS_TABLES)
      .findOne(findOptions);

    if (!receipt) {
      throw new ReceiptNotFoundException();
    }
    return receipt;
  }
}

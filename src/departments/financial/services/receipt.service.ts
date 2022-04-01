import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  FindOptions,
  InstanceDestroyOptions,
  Op,
  WhereOptions,
} from 'sequelize';
import { SalaryService } from './salary.service';
import { DeductionService } from './deduction.service';
import { Sequelize } from 'sequelize-typescript';
import { ReceiptNotFoundException } from '../exceptions';
import { User } from '@app/user/models/user.model';
import { RiaUtils } from '@app/shared/utils';
import { Receipt } from '@app/departments/financial/models/receipt.model';
import { RequestNewReceipt } from '@app/departments/financial/dtos/receipt/create-receipt.dto';
import { FindAllReceiptDto } from '@app/departments/financial/dtos/receipt/find-all-receipt.dto';
import { Salary } from '@app/departments/financial/models/salary.model';
import { Deduction } from '@app/departments/financial/models/deduction.model';
import { UserService } from '@app/user/services/user.service';
import { JobService } from '@app/departments/financial/salary-scale/job/job.service';
import { SalaryScaleService } from '@app/departments/financial/salary-scale/salary-scale.service';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Receipt) private readonly receiptModel: typeof Receipt,
    private readonly userService: UserService,
    private readonly jobService: JobService,
    private readonly salaryService: SalaryService,
    private readonly salaryScaleService: SalaryScaleService,
    private readonly deductionService: DeductionService,
    private readonly sequelize: Sequelize,
  ) {}
  createOne(admin: User, requestNewReceipt: RequestNewReceipt) {
    return this.sequelize.transaction(async (transaction) => {
      const user = await this.userService.findOne({
        where: {
          id: requestNewReceipt.userId,
        },
      });
      const salaryScale = await this.salaryScaleService.findOne({
        where: {
          isActive: true,
        },
      });
      const userJob = salaryScale.salaryScaleJobs.find(
        (ssj) => ssj.jobId === user.jobId,
      );
      const createdReceipt = await this.receiptModel.create({
        userId: user.id,
      });
      const { salary } = requestNewReceipt;
      await this.salaryService.createOne({
        ...salary,
        amount: userJob.amount,
        receiptId: createdReceipt.id,
      });
      if (requestNewReceipt.deductions) {
        const { deductions } = requestNewReceipt;
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
        include: [
          {
            model: Salary,
          },
          {
            model: Deduction,
          },
        ],
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
            },
            {
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
    const count = await this.receiptModel.count(findOptions);
    if (findAllReceiptDto.page || findAllReceiptDto.limit) {
      RiaUtils.applyPagination(findOptions, {
        page: findAllReceiptDto.page,
        limit: findAllReceiptDto.limit,
      });
    }
    return {
      data: await this.receiptModel.findAll(findOptions),
      count,
    };
  }
  async findOne(findOptions: FindOptions<Receipt>) {
    const receipt = await this.receiptModel.findOne(findOptions);
    if (!receipt) {
      throw new ReceiptNotFoundException();
    }
    return receipt;
  }

  async deleteOne(
    findOptions?: FindOptions<Receipt>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const instance = await this.findOne(findOptions);
    await instance.destroy(instanceDestroyOptions);
    return {
      message: 'deleted successfully',
    };
  }

  async updateOne(id: number, updateReceiptDto: RequestNewReceipt) {
    const receipt = await this.findOne({
      where: {
        id,
      },
    });
    return this.sequelize.transaction(async (transaction) => {
      const { salary } = updateReceiptDto;
      if (salary) {
        await this.salaryService.upsert({
          ...salary,
          receiptId: receipt.id,
          amount: 10,
        });
      }
      if (updateReceiptDto.deductions) {
        await this.deductionService.deleteMany(
          {
            where: {
              receiptId: receipt.id,
            },
          },
          {
            force: true,
          },
        );
        await Promise.all(
          updateReceiptDto.deductions.map((aDeduction) =>
            this.deductionService.upsert({
              ...aDeduction,
              receiptId: receipt.id,
            }),
          ),
        );
      }
      return this.findOne({
        where: {
          id,
        },
        include: [User, Deduction, Salary],
      });
    });
  }

  async deleteManyReceipts(
    findOptions?: FindOptions<Salary>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const instances = await this.receiptModel.findAll(findOptions);
    return this.sequelize.transaction(async (transaction) => {
      await Promise.all(
        instances.map((i) => i.destroy(instanceDestroyOptions)),
      );
      return {
        message: 'Deleted successfully.!',
      };
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, InstanceDestroyOptions, UpsertOptions } from 'sequelize';
import {
  Salary,
  SalaryAttributes,
  SalaryCreationAttributes,
} from '@app/departments/financial/models/salary.model';
import { CreateSalaryDto } from '@app/departments/financial/dtos/salary/create-salary.dto';
import { SalaryNotFoundException } from '@app/departments/financial/exceptions';
import { Deduction } from '@app/departments/financial/models/deduction.model';
import { UpdateSalaryDto } from '@app/departments/financial/dtos/salary/update-salary.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary) private readonly salaryModel: typeof Salary,
    private readonly sequelize: Sequelize,
  ) {}
  createOne(createSalaryDto: CreateSalaryDto) {
    return this.salaryModel.create(createSalaryDto);
  }
  findAll(findOptions?: FindOptions) {
    return this.salaryModel.findAll(findOptions);
  }
  async findOne(findOptions?: FindOptions<Salary>) {
    const instance = await this.salaryModel.findOne(findOptions);
    if (!instance) {
      throw new SalaryNotFoundException();
    }
    return instance;
  }
  upsert(
    salaryCreationAttrs: SalaryCreationAttributes,
    options?: UpsertOptions<SalaryAttributes>,
  ) {
    return this.salaryModel.upsert(salaryCreationAttrs, options);
  }

  async deleteOne(
    findOptions?: FindOptions<Deduction>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const instance = await this.findOne(findOptions);
    return instance.destroy(instanceDestroyOptions);
  }
  async deleteMany(
    findOptions?: FindOptions<Salary>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const instances = await this.salaryModel.findAll(findOptions);
    return this.sequelize.transaction(async (transaction) => {
      await Promise.all(
        instances.map((i) => i.destroy(instanceDestroyOptions)),
      );
      return {
        message: 'Deleted successfully.!',
      };
    });
  }

  async updateOne(
    receiptId: number,
    id: number,
    updateSalaryDto: UpdateSalaryDto,
  ) {
    const instance = await this.findOne({
      where: {
        receiptId,
        id,
      },
    });
    return instance.update(updateSalaryDto);
  }
}

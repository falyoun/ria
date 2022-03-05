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
import { UpdateDeductionDto } from '@app/departments/financial/dtos/deduction/update-deduction.dto';
import { UpdateSalaryDto } from '@app/departments/financial/dtos/salary/update-salary.dto';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary) private readonly salaryModel: typeof Salary,
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

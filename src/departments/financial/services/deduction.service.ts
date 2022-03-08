import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, InstanceDestroyOptions, UpsertOptions } from 'sequelize';
import { CreateDeductionDto } from '@app/departments/financial/dtos/deduction/create-deduction.dto';
import {
  Deduction,
  DeductionAttributes,
  DeductionCreationAttributes,
} from '@app/departments/financial/models/deduction.model';
import { Sequelize } from 'sequelize-typescript';
import { DeductionNotFoundException } from '@app/departments/financial/exceptions';
import { UpdateDeductionDto } from '@app/departments/financial/dtos/deduction/update-deduction.dto';

@Injectable()
export class DeductionService {
  constructor(
    @InjectModel(Deduction) private readonly deductionModel: typeof Deduction,
    private readonly sequelize: Sequelize,
  ) {}
  createOne(createDeductionDto: CreateDeductionDto) {
    return this.deductionModel.create(createDeductionDto);
  }
  bulkCreate(createDeductionDtos: CreateDeductionDto[]) {
    return this.deductionModel.bulkCreate(createDeductionDtos);
  }
  findAll(findOptions?: FindOptions<Deduction>) {
    return this.deductionModel.findAll(findOptions);
  }
  async findOne(findOptions?: FindOptions<Deduction>) {
    const instance = await this.deductionModel.findOne(findOptions);
    if (!instance) throw new DeductionNotFoundException();
    return instance;
  }
  async upsert(
    deductionCreationAttrs: DeductionCreationAttributes,
    options?: UpsertOptions<DeductionAttributes>,
  ) {
    return this.deductionModel.upsert(deductionCreationAttrs, options);
  }
  async deleteOne(
    findOptions?: FindOptions<Deduction>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const instance = await this.findOne(findOptions);
    await instance.destroy(instanceDestroyOptions);
    return {
      message: 'deleted successfully.!'
    }
  }
  async deleteMany(
    findOptions?: FindOptions<Deduction>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const deductions = await this.deductionModel.findAll(findOptions);
    return this.sequelize.transaction(async (transaction) => {
      await Promise.all(
        deductions.map((d) => d.destroy(instanceDestroyOptions)),
      );
      return {
        message: 'Deleted deductions',
      };
    });
  }

  async updateOne(
    receiptId: number,
    id: number,
    updateDeductionDto: UpdateDeductionDto,
  ) {
    const instance = await this.findOne({
      where: {
        receiptId,
        id,
      },
    });
    return instance.update(updateDeductionDto);
  }
}

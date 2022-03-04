import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, InstanceDestroyOptions, UpsertOptions } from 'sequelize';
import { CreateDeductionDto } from '@app/departments/financial/dtos/deduction/create-deduction.dto';
import {
  Deduction,
  DeductionAttributes,
  DeductionCreationAttributes,
} from '@app/departments/financial/models/deduction.model';
import { find } from 'rxjs';

@Injectable()
export class DeductionService {
  constructor(
    @InjectModel(Deduction) private readonly deductionModel: typeof Deduction,
  ) {}
  createOne(createDeductionDto: CreateDeductionDto) {
    return this.deductionModel.create(createDeductionDto);
  }
  bulkCreate(createDeductionDtos: CreateDeductionDto[]) {
    return this.deductionModel.bulkCreate(createDeductionDtos);
  }
  findAll() {
    return this.deductionModel.findAll();
  }
  findOne(findOptions?: FindOptions<Deduction>) {
    return this.deductionModel.findOne(findOptions);
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
    return instance.destroy(instanceDestroyOptions);
  }
  async deleteMany() {}
}

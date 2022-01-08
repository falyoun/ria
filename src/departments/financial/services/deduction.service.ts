import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Deduction } from '../models';
import { CreateDeductionDto } from '../dtos';
import { FindOptions } from 'sequelize';

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
}

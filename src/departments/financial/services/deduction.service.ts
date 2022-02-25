import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { CreateDeductionDto } from '@app/departments/financial/dtos/deduction/create-deduction.dto';
import { Deduction } from '@app/departments/financial/models/deduction.model';

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

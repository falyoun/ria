import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Salary } from '../models';
import { CreateSalaryDto } from '../dtos';
import { FindOptions } from 'sequelize';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary) private readonly salaryModel: typeof Salary,
  ) {}
  createOne(createSalaryDto: CreateSalaryDto) {
    return this.salaryModel.create(createSalaryDto);
  }
  findAll() {
    return this.salaryModel.findAll();
  }
  findOne(findOptions?: FindOptions<Salary>) {
    return this.salaryModel.findOne(findOptions);
  }
}

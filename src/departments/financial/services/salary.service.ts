import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { Salary } from '@app/departments/financial/models/salary.model';
import { CreateSalaryDto } from '@app/departments/financial/dtos/salary/create-salary.dto';

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

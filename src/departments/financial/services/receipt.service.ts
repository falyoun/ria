import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Receipt } from '../models';
import { CreateReceiptDto } from '../dtos';
import { FindOptions } from 'sequelize';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Receipt) private readonly receiptModel: typeof Receipt,
  ) {}
  createOne(createReceiptDto: CreateReceiptDto) {
    return this.receiptModel.create(createReceiptDto);
  }
  findAll() {
    return this.receiptModel.findAll();
  }
  findOne(findOptions?: FindOptions<Receipt>) {
    return this.receiptModel.findOne(findOptions);
  }
}

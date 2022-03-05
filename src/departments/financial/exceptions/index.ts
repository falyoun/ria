import { HttpStatus } from '@nestjs/common';
import { CodedException } from '@app/shared/exceptions/coded-exception';

export class ReceiptNotFoundException extends CodedException {
  constructor() {
    super(
      'RECEIPT_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      'receipt not found exception',
    );
  }
}

export class DeductionNotFoundException extends CodedException {
  constructor() {
    super(
      'DEDUCTION_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      'Deduction does not exist',
    );
  }
}

export class SalaryNotFoundException extends CodedException {
  constructor() {
    super('SALARY_NOT_FOUND', HttpStatus.NOT_FOUND, 'Salary does not exist');
  }
}

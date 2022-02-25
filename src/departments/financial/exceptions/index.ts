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

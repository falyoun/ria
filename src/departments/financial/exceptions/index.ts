import { CodedException } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class ReceiptNotFoundException extends CodedException {
  constructor() {
    super(
      'RECEIPT_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      'receipt not found exception',
    );
  }
}

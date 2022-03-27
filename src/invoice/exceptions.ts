import { ResourceNotFoundException } from '@app/shared/exceptions/coded-exception';

export class InvoiceNotFoundException extends ResourceNotFoundException {
  constructor() {
    super('INVOICE');
  }
}

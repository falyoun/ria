import { ResourceNotFoundException } from '@app/shared/exceptions/coded-exception';

export class FileNotFoundException extends ResourceNotFoundException {
  constructor() {
    super('FILE_NOT_FOUND');
  }
}

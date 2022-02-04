import { ResourceNotFoundException } from '@app/shared';

export class FileNotFoundException extends ResourceNotFoundException {
  constructor() {
    super('FILE_NOT_FOUND');
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionCode } from '../index';

export class CodedException extends HttpException {
  code: ExceptionCode;
  args: any;

  constructor(
    code: ExceptionCode,
    statusCode: HttpStatus,
    message: string,
    args?: any,
  ) {
    super(message, statusCode);
    this.code = code;
    this.args = args;
  }
}

export class ResourceNotFoundException extends CodedException {
  constructor(code?: string) {
    super(
      code || 'RESOURCE_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      `Resource not found`,
    );
  }
}

export class ResourceNotAccessibleException extends CodedException {
  constructor(resourceType: string, accessType?: string) {
    super(
      `${resourceType}_INACCESSIBLE`,
      HttpStatus.FORBIDDEN,
      `Resource Inaccessible` +
        (accessType == null ? '' : ` for access type <${accessType}>`),
    );
  }
}

export class UnhandledException extends CodedException {
  constructor() {
    super(`500`, HttpStatus.INTERNAL_SERVER_ERROR, `Internal server error`);
  }
}

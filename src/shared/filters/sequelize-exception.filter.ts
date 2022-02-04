import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseError, UniqueConstraintError } from 'sequelize';
import { ForeignKeyConstraintError } from 'sequelize';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Catch(BaseError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    const additionals: any = {};

    if (exception instanceof UniqueConstraintError) {
      additionals.fields = exception.fields;
      statusCode = HttpStatus.BAD_REQUEST;
      message = exception.parent.message;
      additionals.code = 'DUPLICATED_ENTRY';
    } else if (exception instanceof ForeignKeyConstraintError) {
      additionals.fields = exception.fields;
      statusCode = HttpStatus.BAD_REQUEST;
      message = exception.parent.message;
      additionals.code = 'OTHER_ENTITIES_ARE_STILL_ATTACHED';
    }
    if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR) console.log(exception);
    response.status(statusCode).json({
      statusCode,
      message,
      ...additionals,
    });
  }
}

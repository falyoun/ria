import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

export function handleException(exception: any, host: ArgumentsHost) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  let statusCode;
  try {
    statusCode = exception.getStatus();
  } catch (e) {
    statusCode = 500;
  }
  console.log('global error: ', exception);
  response.status(statusCode).json({
    statusCode: statusCode,
    code: exception.code || statusCode,
    args: exception.args,
    message: exception.message,
  });
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    handleException(exception, host);
  }
}

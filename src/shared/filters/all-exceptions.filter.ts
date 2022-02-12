import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

export function handleException(exception: any, host: ArgumentsHost) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  console.log('global error: ', exception);
  response.status(exception.getStatus()).json({
    statusCode: exception.getStatus(),
    code: exception.code || exception.getStatus(),
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

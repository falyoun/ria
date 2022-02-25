import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { CodedException } from '@app/shared/exceptions/coded-exception';
export function handleCodedException(
  exception: CodedException,
  host: ArgumentsHost,
) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  response.status(exception.getStatus()).json({
    statusCode: exception.getStatus(),
    code: exception.code || exception.getStatus(),
    args: exception.args,
    message: exception.message,
  });
}

@Catch(CodedException)
export class CodedExceptionFilter implements ExceptionFilter {
  catch(exception: CodedException, host: ArgumentsHost) {
    handleCodedException(exception, host);
  }
}

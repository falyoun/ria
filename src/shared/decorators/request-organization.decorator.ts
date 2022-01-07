import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
const paramDecorator = (_data: unknown, ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest<Request>()['organization'];
export const RequestOrganization = createParamDecorator(paramDecorator);

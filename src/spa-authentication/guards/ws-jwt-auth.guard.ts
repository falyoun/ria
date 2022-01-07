import { ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthGuard } from '@nestjs/passport';
import { StrategiesNames } from '../shared';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard extends AuthGuard(StrategiesNames.ALPHA_WS_JWT) {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new WsException('Cookies required');
    }
    return user;
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient<Socket>();
  }
}

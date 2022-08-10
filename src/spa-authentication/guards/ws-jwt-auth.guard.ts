import { ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthGuard } from '@nestjs/passport';
import { StrategiesNames } from '../shared';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard extends AuthGuard(StrategiesNames.ITE_WS_JWT) {
  canActivate(context: ExecutionContext) {
    console.log('context: ', context);
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any) {
    console.log('error: ', err);
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new WsException('Token is required');
    }
    return user;
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient<Socket>();
  }
}

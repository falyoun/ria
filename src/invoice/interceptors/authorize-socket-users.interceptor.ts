import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { SpaAuthService } from '@app/spa-authentication/services/spa-auth.service';

@Injectable()
export class AuthorizeSocketUsersInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: SpaAuthService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const client = context.switchToWs().getClient() as Socket;
    const token = client.handshake.headers.authorization;
    if (!token) {
      client.disconnect();
      throw new WsException('unauthorized');
    }
    try {
      const payload = this.jwtService.verifyAccessToken(token);
      context.switchToWs().getData().userId = payload.id;
    } catch (error) {
      client.disconnect();
      throw new WsException('unauthorized');
    }
    return next.handle();
  }
}

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import { SpaAuthService } from '@app/spa-authentication/services/spa-auth.service';
import { WsJwtAuthGuard } from '@app/spa-authentication/guards/ws-jwt-auth.guard';
import { User } from '@app/user/models/user.model';
import { UserService } from '@app/user/services/user.service';
import { RiaInvoiceEvents } from '@app/invoice/events/invoice.events';
import { InvoiceAnalyzedDto } from '@app/invoice/dtos/invoice-flow-dtos/invoice-analyzed.dto';
type SocketWithUser = Socket & { user: User };

@WebSocketGateway({
  // path: '/invoice-socket',
  namespace: '/flutter',
  // allowRequest: (req, callback) => {
  //   const isOriginValid = true;
  //   console.log('user-agent: ', req.headers['user-agent']);
  //   console.log('req.auth: ', req.headers['authorization']);
  //   console.log('req: ', req['headers']);
  //   callback(null, isOriginValid);
  // },
  allowEIO3: true,
  // transports: ['polling'],
  allowUpgrades: true,
  // transports: ['websocket', 'polling'],
  cors: {
    // allowedHeaders:
    //   'X-Requested-With, x-organization-id, X-HTTP-Method-Override, Access-Control-Allow-Origin, Content-Type, Accept, Observe, Origin,X-Requested-With,Accept,Authorization,authorization,X-Forwarded-for',
    // methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'authorization'],
    credentials: true,
    origin: /.*/, // new RegExp('(http(s)?://)?(.+.)?(ria|localhost|127.0.0.1).*$'),
  },
})
// @UseGuards(WsJwtAuthGuard)
export class InvoiceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly spaAuthService: SpaAuthService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  connectedUsers = new Map<number, string[]>();
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('InvoiceGateway');

  handleDisconnect(client: Socket) {
    console.log('disconnect: ', client.id);
    try {
      const usersEntries = this.connectedUsers.entries();
      while (!usersEntries.next().done) {
        const [key, value] = usersEntries.next().value;
        if (value?.includes(client.id)) {
          if (value.length === 1) {
            this.connectedUsers.delete(key);
          } else {
            this.connectedUsers.set(
              key,
              value.filter((v) => v !== client.id),
            );
          }
        }
      }
      this.logger.log(`Client disconnected: ${client.id}`);
    } catch (error) {}
  }

  async handleConnection(client: Socket) {
    console.log('client: ', client.handshake.headers);
    console.log('client: ', client.handshake.auth);
    const token =
      client?.handshake?.headers?.authorization ||
      client?.handshake?.auth['authorization'];
    console.log('token: ', token);
    if (!token) {
      client.disconnect(true);
      return;
    }
    try {
      const payload = this.spaAuthService.verifyAccessToken(token);
      const user = await this.userService.findOne({
        where: {
          id: payload['id'],
          email: payload['email'],
        },
      });
      const userSockets = this.connectedUsers.get(user.id);
      if (userSockets && userSockets.length) {
        this.connectedUsers.set(user.id, userSockets.concat(client.id));
      } else {
        this.connectedUsers.set(user.id, [client.id]);
      }
      const roomName = `${user.id}`;
      console.log('roomName: ', roomName);
      client.join(roomName);
    } catch (error) {
      console.log('error: ', error);
      client.disconnect(true);
    }
  }

  emitInvoiceStatusChanged(invoiceStatusChangedObj: InvoiceAnalyzedDto) {
    const { userId, invoiceId, status } = invoiceStatusChangedObj;
    // console.log('this.server.sockets: ', this.server.in);
    this.server.in(`${userId}`).emit(RiaInvoiceEvents.INVOICE_ANALYZED, {
      data: {
        invoiceId,
        status,
      },
    });
  }
}

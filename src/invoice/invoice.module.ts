import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Invoice } from '@app/invoice/invoice.model';
import { InvoiceCrudController } from '@app/invoice/controllers/invoice-crud.controller';
import { InvoiceFlowController } from '@app/invoice/controllers/invoice-flow.controller';
import { InvoiceCrudService } from '@app/invoice/services/invoice-crud.service';
import { InvoiceFlowService } from '@app/invoice/services/invoice-flow.service';
import { AppFileModule } from '@app/global/app-file/app-file.module';
import { UserModule } from '@app/user/user.module';
import { DataBox } from '@app/invoice/data-box.model';
import { BeneficiaryModule } from '@app/beneficiary/beneficiary.module';
import { InvoiceGateway } from '@app/invoice/gateways/invoice-socket.gateway';
import { JwtStrategy, SpaAuthenticationModule } from '@app/spa-authentication';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IAuth } from '@app/global/app-config/app-config.interface';
import { DatabaseConnectionService } from '@app/global/app-database/database-connection.service';
import { User } from '@app/user/models/user.model';
import { SocketJwtStrategy } from '@app/spa-authentication/strategies/ws-jwt-strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([Invoice, DataBox]),
    AppFileModule,
    UserModule,
    BeneficiaryModule,
    SpaAuthenticationModule.registerAsync({
      imports: [
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService<IAppConfig>) => {
            const useAuth = configService.get<IAuth>('useAuth');
            const { useAccessToken } = useAuth;
            return {
              secret: useAccessToken.secretKey,
            };
          },
          inject: [ConfigService],
        }),
      ],
      useFactory: (
        configService: ConfigService<IAppConfig>,
        databaseConnectionService: DatabaseConnectionService,
      ) => {
        const useAuth = configService.get<IAuth>('useAuth');
        const { useAccessToken } = useAuth;
        return {
          useAccessToken: {
            jwtAccessSecretKey: useAccessToken.secretKey,
            jwtAccessActivationPeriod: useAccessToken.expiration,
          },
          sequelizeConnection: {
            sequelizeInstance:
              databaseConnectionService.getDatabaseActiveConnection(),
            model: User,
          },
        };
      },
      inject: [ConfigService, DatabaseConnectionService],
      extraProviders: [JwtStrategy, SocketJwtStrategy],
    }),
  ],
  controllers: [InvoiceCrudController, InvoiceFlowController],
  providers: [InvoiceCrudService, InvoiceFlowService, InvoiceGateway],
  exports: [InvoiceCrudService, InvoiceFlowService],
})
export class InvoiceModule {}

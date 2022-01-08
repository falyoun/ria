import { Module } from '@nestjs/common';
import { UserAuthService } from './services';
import { UserAuthController, UserAuthForAdminsController } from './controllers';
import { SpaAuthenticationModule, JwtStrategy } from '@app/spa';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IAuth } from '@app/app-config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule, User } from '@app/user';
import { DatabaseConnectionService } from '@app/app-database';

@Module({
  imports: [
    UserModule,
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
        const { useAccessToken, useRefreshToken } = useAuth;
        return {
          useAccessToken: {
            jwtAccessSecretKey: useAccessToken.secretKey,
            jwtAccessActivationPeriod: useAccessToken.expiration,
          },
          useRefreshToken: {
            jwtRefreshSecretKey: useRefreshToken.secretKey,
            jwtRefreshActivationPeriod: useRefreshToken.expiration,
          },
          sequelizeConnection: {
            sequelizeInstance:
              databaseConnectionService.getDatabaseActiveConnection(),
            model: User,
          },
        };
      },
      inject: [ConfigService, DatabaseConnectionService],
      extraProviders: [JwtStrategy],
    }),
  ],
  providers: [UserAuthService],
  controllers: [UserAuthController, UserAuthForAdminsController],
  exports: [UserAuthService, UserModule],
})
export class UserAuthModule {}

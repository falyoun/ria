import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@app/user/user.module';
import { JwtStrategy, SpaAuthenticationModule } from '@app/spa-authentication';
import { IAppConfig, IAuth } from '@app/global/app-config/app-config.interface';
import { DatabaseConnectionService } from '@app/global/app-database/database-connection.service';
import { User } from '@app/user/models/user.model';
import { UserAuthService } from '@app/user-auth/services/user-auth.service';
import { UserAuthForAdminsController } from '@app/user-auth/controllers/user-auth-for-admins.controller';
import { UserAuthController } from '@app/user-auth/controllers/user-auth.controller';
import { UserAuthForAdminService } from '@app/user-auth/services/user-auth-for-admin.service';
import { DepartmentsModule } from '@app/departments/departments.module';

@Module({
  imports: [
    UserModule,
    DepartmentsModule,
    SpaAuthenticationModule.registerAsync({
      imports: [
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService<IAppConfig>) => {
            const useAuth = configService.get<IAuth>('useAuth');
            const { useAccessToken } = useAuth;
            return {
              secret: useAccessToken.secretKey,
              signOptions: {
                expiresIn: useAccessToken.expiration,
              },
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
  providers: [UserAuthService, UserAuthForAdminService],
  controllers: [UserAuthController, UserAuthForAdminsController],
  exports: [UserAuthService, UserAuthForAdminService, UserModule],
})
export class UserAuthModule {}

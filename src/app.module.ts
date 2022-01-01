import { Module } from '@nestjs/common';
import { SpaAuthenticationModule } from '@app/spa';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule, IAppConfig, IAuth } from '@app/app-config';
import { JwtModule } from '@nestjs/jwt';
import { AppDatabaseModule } from '@app/app-database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@app/user';
@Module({
  imports: [
    AppDatabaseModule,
    AppConfigModule,
    UserModule,
    SpaAuthenticationModule.registerAsync({
      imports: [
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService<IAppConfig>) => {
            const useAuth = configService.get<IAuth>('useAuth');
            return {
              secret: useAuth.useAccessToken.secretKey,
            };
          },
          inject: [ConfigService],
        }),
      ],
      useFactory: (configService: ConfigService<IAppConfig>) => {
        const useAuth = configService.get<IAuth>('useAuth');
        return {
          useAccessToken: {
            jwtAccessSecretKey: useAuth.useAccessToken.secretKey,
            jwtAccessActivationPeriod: useAuth.useAccessToken.expiration,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

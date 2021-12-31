import { Module } from '@nestjs/common';
import { SpaAuthenticationModule } from '@app/spa';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule, IAppConfig, IAuth } from '@app/app-config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    AppConfigModule,
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
  controllers: [],
  providers: [],
})
export class AppModule {}

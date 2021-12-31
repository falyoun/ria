import { DynamicModule, Provider } from '@nestjs/common';
import {
  SpaAuthConstants,
  SpaAuthModuleAsyncOptions,
  SpaAuthModuleOptionsFactory,
  SpaAuthOptions,
} from './shared';
import { SpaAuthService } from './services';
import { JwtModule } from '@nestjs/jwt';

export class SpaAuthenticationModule {
  static register(options: SpaAuthOptions): DynamicModule {
    return {
      module: SpaAuthenticationModule,
      imports: [
        JwtModule.register({
          secret: options.useAccessToken.jwtAccessSecretKey,
        }),
      ],
      providers: [
        {
          provide: SpaAuthConstants.SPA_AUTH_MODULE_OPTIONS,
          useValue: options,
        },
        SpaAuthService,
      ],
      exports: [SpaAuthService],
    };
  }

  static registerAsync(options: SpaAuthModuleAsyncOptions): DynamicModule {
    return {
      module: SpaAuthenticationModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        SpaAuthService,
        ...(options.extraProviders || []),
      ],
      exports: [SpaAuthService],
    };
  }

  private static createAsyncProviders(
    options: SpaAuthModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: SpaAuthModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: SpaAuthConstants.SPA_AUTH_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: SpaAuthConstants.SPA_AUTH_MODULE_OPTIONS,
      useFactory: async (optionsFactory: SpaAuthModuleOptionsFactory) =>
        optionsFactory.createSpaAuthModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}

import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import { ISwagger } from '@app/global/app-swagger/swagger-config.interface';

export interface IAuth {
  useCookies: {
    expiration: number;
  };
  useAccessToken: {
    secretKey: string;
    expiration: string;
  };
  useRefreshToken?: {
    secretKey: string;
    expiration: string;
  };
}
export interface IServer {
  url: string;
  port: number;
  apiPrefix: string;
  swagger: ISwagger;
}

export interface ISwiftcodesapiConfig {
  appKey: string;
}

export interface IAppConfig {
  sequelizeOptions: SequelizeModuleOptions;
  server: IServer;
  useAuth: IAuth;
  swiftcodesapi?: ISwiftcodesapiConfig;
}

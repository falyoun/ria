import { CreateDatabaseOptions } from 'sequelize/types';
import { ISwagger } from '@app/app-swagger';

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
  port: number;
  apiPrefix: string;
  swagger: ISwagger;
}

export interface IAppConfig {
  database: CreateDatabaseOptions;
  server: IServer;
  useAuth: IAuth;
}

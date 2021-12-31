import { Dialect } from 'sequelize/types';
import { ISwagger } from '@app/app-swagger';

export interface IDatabase {
  name: string;
  dialect: Dialect;
  username: string;
  password: string;
  pool?: {
    min: number;
    max: number;
  };
}
export interface IServer {
  port: number;
  apiPrefix: string;
  swagger: ISwagger;
}
export interface IAppConfig {
  database: IDatabase;
  server: IServer;
}

import { Sequelize } from 'sequelize-typescript';
import { ModelType } from 'sequelize-typescript/dist/model/model/model';

export type SpaAuthOptions = {
  useAccessToken: {
    jwtAccessSecretKey: string;
    jwtAccessActivationPeriod: string | number;
  };
  useRefreshToken?: {
    jwtRefreshSecretKey: string;
    jwtRefreshActivationPeriod: string;
  };
  sequelizeConnection?: {
    sequelizeInstance: Sequelize;
    model: string | ModelType<any, any>;
  };
};

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { generateAppConfigFactory } from './app-config-factory';
import { JoiSchema } from './joi-schema';
const getConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return generateAppConfigFactory('../../config/development.yaml');
    case 'staging':
      return generateAppConfigFactory('../../config/staging.yaml');
    case 'production':
      return generateAppConfigFactory('../../config/production.yaml');
  }
};

console.log('App configurations: ', getConfig()());
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      load: [getConfig()],
      validationSchema: JoiSchema,
    }),
  ],
})
export class AppConfigModule {}

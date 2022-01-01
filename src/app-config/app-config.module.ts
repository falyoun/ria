import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { generateAppConfigFactory } from './app-config-factory';
import { JoiSchema } from './joi-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      load: [
        generateAppConfigFactory('../config/development.yaml'),
        generateAppConfigFactory('../config/staging.yaml'),
        generateAppConfigFactory('../config/production.yaml'),
      ],
      validationSchema: JoiSchema,
    }),
  ],
})
export class AppConfigModule {}

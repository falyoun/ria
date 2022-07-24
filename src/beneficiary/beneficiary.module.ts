import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SwiftcodesapiModule } from 'alpha-swiftcodesapi';
import { ConfigService } from '@nestjs/config';
import { Beneficiary } from '@app/beneficiary/models/beneficiary.model';
import {
  IAppConfig,
  ISwiftcodesapiConfig,
} from '@app/global/app-config/app-config.interface';
import { BeneficiaryController } from '@app/beneficiary/controllers/beneficiary.controller';
import { BeneficiaryService } from '@app/beneficiary/services/beneficiary.service';
@Module({
  imports: [
    SequelizeModule.forFeature([Beneficiary]),
    SwiftcodesapiModule.registerAsync({
      useFactory: (configService: ConfigService<IAppConfig>) => {
        const swiftcodesapi =
          configService.get<ISwiftcodesapiConfig>('swiftcodesapi');
        return {
          apiKey: swiftcodesapi?.appKey || '',
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [BeneficiaryService],
  controllers: [BeneficiaryController],
  exports: [BeneficiaryService],
})
export class BeneficiaryModule {}

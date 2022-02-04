import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppFile } from './models';
import { AppFileService } from './services';
import { AppFileController } from './controllers/app-file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { pathToUploadedAvatars } from './constants';

@Module({
  imports: [
    SequelizeModule.forFeature([AppFile]),
    MulterModule.register({
      dest: pathToUploadedAvatars,
      limits: { fileSize: 20971520 },
    }),
  ],
  providers: [AppFileService],
  controllers: [AppFileController],
  exports: [AppFileService, SequelizeModule.forFeature([AppFile])],
})
export class AppFileModule {}

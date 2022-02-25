import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppFileController } from './controllers/app-file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { pathToUploadedAvatars } from './constants';
import { AppFile } from '@app/global/app-file/models/app-file.model';
import { AppFileService } from '@app/global/app-file/services/app-file.service';

@Module({
  imports: [
    SequelizeModule.forFeature([AppFile]),
    MulterModule.register({
      dest: pathToUploadedAvatars,
      // limits: { fileSize: 2097152000 },
    }),
  ],
  providers: [AppFileService],
  controllers: [AppFileController],
  exports: [AppFileService, SequelizeModule.forFeature([AppFile])],
})
export class AppFileModule {}

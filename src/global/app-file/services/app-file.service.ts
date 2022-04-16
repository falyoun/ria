import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, InstanceDestroyOptions } from 'sequelize';
import { FileNotFoundException } from '../exceptions';
import { ConfigService } from '@nestjs/config';
import { AppFile } from '@app/global/app-file/models/app-file.model';
import {
  IAppConfig,
  IServer,
} from '@app/global/app-config/app-config.interface';
import { CreateAppFileDto } from '@app/global/app-file/dtos/create-app-file.dto';

@Injectable()
export class AppFileService {
  constructor(
    @InjectModel(AppFile) private readonly appFileModel: typeof AppFile,
    private readonly configService: ConfigService<IAppConfig>,
  ) {}
  createFile(createAppFileDto: Omit<CreateAppFileDto, 'url'>) {
    const serverUrl = this.configService.get<IServer>('server').url;
    return this.appFileModel.create({
      filename: createAppFileDto.filename,
      path: createAppFileDto.path,
      mimetype: createAppFileDto.mimetype,
      url: `${serverUrl}/${createAppFileDto.path}`,
    });
  }
  async getFile(findOptions?: FindOptions<AppFile>) {
    const file = await this.appFileModel.findOne(findOptions);
    if (!file) throw new FileNotFoundException();
    return file;
  }
}

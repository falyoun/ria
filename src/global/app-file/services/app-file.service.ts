import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AppFile } from '../models';
import { CreateAppFileDto } from '../dtos';
import { v4 as uuidv4 } from 'uuid';
import { FindOptions } from 'sequelize';
import { FileNotFoundException } from '../exceptions';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IServer } from '@app/app-config';

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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserModelScopes } from '../models';
import { UpdateUserDto } from '../dtos';
import { FindOptions } from 'sequelize';
import { AccountNotFoundException } from '../exceptions';
import { AppFileService } from '../../global/app-file/services';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly appFileService: AppFileService,
  ) {}

  async findOne(findOptions: FindOptions<User>) {
    const user = await this.userModel
      .scope(UserModelScopes.JOIN_USER_ROLE_TABLES)
      .findOne(findOptions);
    if (!user) {
      throw new AccountNotFoundException();
    }
    return user;
  }

  async updateOne(findOptions: FindOptions<User>, updateDto: UpdateUserDto) {
    const user = await this.findOne(findOptions);
    if (updateDto.avatarId) {
      await this.appFileService.getFile({
        where: {
          id: updateDto.avatarId,
        },
      });
    }
    return user.update(updateDto);
  }
}

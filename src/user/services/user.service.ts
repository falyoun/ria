import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { AccountNotFoundException } from '../exceptions';
import { User, UserModelScopes } from '@app/user/models/user.model';
import { AppFileService } from '@app/global/app-file/services/app-file.service';
import { UpdateUserDto } from '@app/user/dtos/update-user.dto';

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

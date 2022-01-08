import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserModelScopes } from '../models';
import { UpdateUserDto } from '../dtos';
import { FindOptions } from 'sequelize';
import { AccountNotFoundException } from '../exceptions';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

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
    return user.update(updateDto);
  }
}

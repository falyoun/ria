import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserModelScopes } from '../models';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { FindOptions } from 'sequelize';
import { AccountNotFoundException } from '../exceptions';
import { RiaUtils, SequelizePaginationDto } from '@app/shared';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  createOne(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

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
    await user.update(updateDto);
    return this.findOne(findOptions);
  }

  async verifyUser(findOptions: FindOptions<User>) {
    const user = await this.findOne(findOptions);
    return user.update({
      isVerified: true,
    });
  }

  async activateUser(findOptions: FindOptions<User>) {
    const user = await this.findOne(findOptions);
    return user.update({
      isActive: true,
    });
  }

  activateAndVerifyUserByRef(user: User) {
    return user.update({
      isActive: true,
      isVerified: true,
    });
  }
  findAll(
    findOptions: FindOptions,
    sequelizePaginationQuery?: SequelizePaginationDto,
  ) {
    RiaUtils.applyPagination(findOptions, sequelizePaginationQuery);
    return this.userModel.findAll(findOptions);
  }
}

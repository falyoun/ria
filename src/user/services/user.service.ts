import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../models';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { FindOptions } from 'sequelize';
import { AccountNotFoundException } from '../exceptions';
import { RiaUtils, SequelizePaginationDto } from '../../shared';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  createOne(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findOne(findOptions: FindOptions<UserModel>) {
    const user = await this.userModel.findOne(findOptions);
    if (!user) {
      throw new AccountNotFoundException();
    }
    return user;
  }

  async updateOne(
    findOptions: FindOptions<UserModel>,
    updateDto: UpdateUserDto,
  ) {
    const user = await this.findOne(findOptions);
    await user.update(updateDto);
    return this.findOne(findOptions);
  }

  findAll(
    findOptions: FindOptions,
    sequelizePaginationQuery?: SequelizePaginationDto,
  ) {
    RiaUtils.applyPagination(findOptions, sequelizePaginationQuery);
    return this.userModel.findAll(findOptions);
  }
}

import { Injectable } from '@nestjs/common';
import { User, UserModelScopes } from '../models';
import { FindSystemUsersDto } from '../dtos';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { RiaUtils } from '@app/shared';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserForAdminService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findSystemUsers(admin: User, findSystemUsersDto: FindSystemUsersDto) {
    let whereOptions: WhereOptions<User> = {
      id: {
        [Op.ne]: admin.id,
      },
    };
    if (findSystemUsersDto.email) {
      whereOptions = {
        ...whereOptions,
        email: {
          [Op.like]: `%${findSystemUsersDto.email}%`,
        },
      };
    }
    if (findSystemUsersDto.isActive !== undefined) {
      whereOptions = {
        ...whereOptions,
        isActive: {
          [Op.eq]: findSystemUsersDto.isActive,
        },
      };
    }
    if (findSystemUsersDto.isVerified !== undefined) {
      whereOptions = {
        ...whereOptions,
        isActive: findSystemUsersDto.isVerified,
      };
    }
    const findOptions: FindOptions<User> = { where: whereOptions };
    if (findSystemUsersDto.page || findSystemUsersDto.limit) {
      RiaUtils.applyPagination(findOptions, {
        page: findSystemUsersDto.page,
        limit: findSystemUsersDto.limit,
      });
    }
    return {
      data: await this.userModel
        .scope(UserModelScopes.JOIN_USER_ROLE_TABLES)
        .findAll(findOptions),
      count: await this.userModel.count(findOptions),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@app/user/models/user.model';
import { FindSystemUsersDto } from '@app/user/dtos/for-admin/find-system-users.dto';
import { RiaUtils } from '@app/shared/utils';
import { AssignJobToUserDto } from '@app/user/dtos/for-admin/assign-job-to-user.dto';
import { JobService } from '@app/departments/financial/salary-scale/job/job.service';

@Injectable()
export class UserForAdminService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jobService: JobService,
  ) {}

  async assignJobToUser(
    userId: number,
    assignJobToUserDto: AssignJobToUserDto,
  ) {
    const job = await this.jobService.findOne({
      where: {
        id: assignJobToUserDto.jobId,
      },
    });
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });
    return user.update({
      jobId: job.id,
      level: assignJobToUserDto.level,
    });
  }
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
      data: await this.userModel.findAll(findOptions),
      count: await this.userModel.count(findOptions),
    };
  }
}

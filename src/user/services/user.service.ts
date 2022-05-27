import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { AccountNotFoundException } from '../exceptions';
import { User } from '@app/user/models/user.model';
import { AppFileService } from '@app/global/app-file/services/app-file.service';
import { PatchUserDto, UpdateUserDto } from '@app/user/dtos/update-user.dto';
import { UserRoleService } from '@app/role/serviecs/user-role.service';
import { Sequelize } from 'sequelize-typescript';
import { SalaryScaleService } from '@app/departments/financial/salary-scale/salary-scale.service';
import { LeaveService } from '@app/leave/services/leave.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly appFileService: AppFileService,
    private readonly userRoleService: UserRoleService,
    private readonly sequelize: Sequelize,
    private readonly salaryScaleJob: SalaryScaleService,
    private readonly leaveService: LeaveService,
  ) {}

  async findOne(findOptions: FindOptions<User>) {
    const user = await this.userModel.findOne(findOptions);
    if (!user) {
      throw new AccountNotFoundException();
    }
    return user;
  }

  async findUserProfile(userId: number) {
    const user = await this.findOne({
      where: {
        id: userId,
      },
    });
    return this.findMyProfile(user);
  }
  async findMyProfile(user: User) {
    const profile = {
      ...user.toJSON(),
    };
    const salaryScale = await this.salaryScaleJob.findOne({
      where: {
        isActive: true,
      },
    });
    if (salaryScale && salaryScale.salaryScaleJobs && user.jobId) {
      const userJob = salaryScale.salaryScaleJobs.find(
        (ssj) => ssj.jobId === user.jobId && ssj.employeeLevel === user.level,
      );
      profile['salaryScaleJob'] = userJob;
      profile['salary'] = userJob.amount;
    }

    const myLeaves = await this.leaveService.findAll({
      requestersIds: [user.id],
    });
    if (myLeaves) {
      profile['leaves'] = myLeaves.data.map((l) => l.toJSON());
    }
    return profile;
  }

  async patchOne(id: number, patchDto: PatchUserDto) {
    const requestedUser = await this.findOne({
      where: {
        id,
      },
    });
    if (patchDto.role) {
      return this.sequelize.transaction(async (transaction) => {
        await this.userRoleService.assignNewRoleToUser(id, patchDto.role);
        patchDto['role'] = undefined;
        return requestedUser.update(patchDto);
      });
    }
    return requestedUser.update(patchDto);
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

  findAll(findOptions: FindOptions<User>) {
    return this.userModel.findAll(findOptions);
  }
}

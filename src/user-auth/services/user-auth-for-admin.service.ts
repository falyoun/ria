import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from '@app/user/models/user.model';
import { UserService } from '@app/user/services/user.service';
import { ApproveUserToJoinSystemDto } from '@app/user/dtos/for-admin/approve-user-to-join-system.dto';
import { DepartmentsService } from '@app/departments/services/departments.service';
import { LeaveService } from '@app/leave/services/leave.service';
import { ReplaceUserLeavesCategoriesForUserDto } from '@app/user-auth/dtos/for-admin/replace-user-leaves-categories-for-user.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UserAuthForAdminService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly configService: ConfigService,
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService,
    private readonly departmentsService: DepartmentsService,
    private readonly leavesService: LeaveService,
  ) {}

  async replaceUserLeavesCategoriesForUser(
    replaceDto: ReplaceUserLeavesCategoriesForUserDto,
  ) {
    await this.userService.findOne({
      where: {
        id: replaceDto.userId,
      },
    });
    return this.leavesService.replaceUserLeavesCategories(replaceDto);
  }
  async approveUserToJoinTheSystem(
    approveUserToJoinSystemDto: ApproveUserToJoinSystemDto,
  ) {
    const user = await this.userService.findOne({
      where: {
        id: approveUserToJoinSystemDto.id,
      },
    });
    await this.departmentsService.findOne({
      where: {
        id: approveUserToJoinSystemDto.departmentId,
      },
    });
    try {
      await this.leavesService.bulkCreateDefaultCategoriesForANewUser(
        approveUserToJoinSystemDto.id,
      );
    } catch (e) {
      console.log(e);
    }
    return user.update({
      isVerified: true,
      isActive: true,
      departmentId: approveUserToJoinSystemDto.departmentId,
    });
  }
  async rejectUser(userId: number) {
    const user = await this.userService.findOne({
      where: {
        id: userId,
      },
    });

    await user.destroy();
    return {
      message: 'deleted',
    };
  }
}

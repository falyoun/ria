import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Leave } from '@app/leave/models/leave.model';
import { User } from '@app/user/models/user.model';
import { CreateLeaveDto } from '@app/leave/dtos/create-leave.dto';
import { CodedException } from '@app/shared/exceptions/coded-exception';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { LeaveStatusEnum } from '@app/leave/enums/leave-status.enum';
import { RiaUtils } from '@app/shared/utils';
import { FindManyLeavesDto } from '@app/leave/dtos/find-many-leaves.dto';
import { LeaveCategoriesService } from '@app/leave/services/leave-categories.service';
import { UserLeaveCategory } from '@app/leave/models/user-leave-category.model';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserLeaveCategoryDto } from '@app/leave/dtos/create-user-leave-category.dto';
import { ReplaceUserLeavesCategoriesForUserDto } from '@app/user-auth/dtos/for-admin/replace-user-leaves-categories-for-user.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(Leave) private readonly leaveModel: typeof Leave,
    @InjectModel(UserLeaveCategory)
    private readonly userLeaveCategoryModel: typeof UserLeaveCategory,
    private readonly leaveCategoriesService: LeaveCategoriesService,
    private readonly sequelize: Sequelize,
  ) {}

  async replaceUserLeavesCategories(
    replaceDto: ReplaceUserLeavesCategoriesForUserDto,
  ) {
    return this.sequelize.transaction(async (transaction) => {
      await this.userLeaveCategoryModel.destroy({
        force: true,
        where: {
          userId: replaceDto.userId,
        },
      });
      return this.userLeaveCategoryModel.bulkCreate(
        replaceDto.userLeavesCategories.map((m) => ({
          ...m,
          userId: replaceDto.userId,
        })),
      );
    });
  }
  async bulkCreateDefaultCategoriesForANewUser(userId: number) {
    const allCategories = await this.leaveCategoriesService.findAll();
    allCategories.data.map((cat) =>
      this.userLeaveCategoryModel.create({
        userId,
        leaveCategoryId: cat.id,
        numberOfDaysAllowed: 4,
      }),
    );
  }
  async createUserLeaveCategoryForUser(dto: CreateUserLeaveCategoryDto) {
    return this.userLeaveCategoryModel.create(dto);
  }
  async findOne(findOptions: FindOptions<Leave>) {
    const leave = await this.leaveModel.scope('all-users').findOne(findOptions);
    if (!leave) {
      throw new CodedException(
        'LEAVE_NOT_FOUND',
        HttpStatus.BAD_REQUEST,
        'Leave does not exist',
      );
    }
    return leave;
  }

  async findAll(findManyLeavesDto?: FindManyLeavesDto) {
    let whereOptions: WhereOptions<Leave> = {};
    if (
      findManyLeavesDto &&
      findManyLeavesDto.requestersIds &&
      findManyLeavesDto.requestersIds.length > 0
    ) {
      whereOptions = {
        ...whereOptions,
        requesterId: {
          [Op.in]: findManyLeavesDto.requestersIds,
        },
      };
    }
    const findOptions: FindOptions<Leave> = {
      where: whereOptions,
    };
    const count = await this.leaveModel.count(findOptions);
    RiaUtils.applyPagination(findOptions, findManyLeavesDto);
    return {
      data: await this.leaveModel.scope('all-users').findAll(findOptions),
      count,
    };
  }
  static checkLeavesIntersection(
    leaves: Leave[],
    fromDate: Date,
    toDate: Date,
  ): boolean {
    // TODO (Check if there's an intersection between dates)
    return false;
  }
  async createOne(user: User, createLeaveDto: CreateLeaveDto) {
    const userLeaves = await this.leaveModel.findAll({
      where: {
        requesterId: user.id,
      },
    });
    if (
      LeaveService.checkLeavesIntersection(
        userLeaves,
        createLeaveDto.fromDate,
        createLeaveDto.toDate,
      )
    ) {
      throw new CodedException(
        'INVALID_INTERSECTION_DATE',
        HttpStatus.BAD_REQUEST,
        'Invalid leave date',
      );
    }

    const leaveCategory = await this.leaveCategoriesService.findOne({
      where: {
        id: createLeaveDto.leaveCategoryId,
      },
    });
    const userLeaveInstance = await this.userLeaveCategoryModel.findOne({
      where: {
        leaveCategoryId: leaveCategory.id,
        userId: user.id,
      },
    });

    if (!userLeaveInstance) {
      throw new CodedException(
        'INVALID_LEAVE_CATEGORY_FOR_USER',
        HttpStatus.BAD_REQUEST,
        'This type of leave is not allowed',
      );
    }
    const { fromDate, toDate } = createLeaveDto;
    const diff = fromDate.getTime() - toDate.getTime();
    const mills = Math.abs(diff);
    const toDeductFromDay = mills / 1000 / 60 / 60 / 24;

    if (userLeaveInstance.numberOfDaysAllowed - toDeductFromDay < 0) {
      throw new CodedException(
        'INVALID_LEAVE_PERIOD',
        HttpStatus.BAD_REQUEST,
        'Leave amount is not applicable for you as you have left ' +
          userLeaveInstance.numberOfDaysAllowed +
          ' of this leave type, kindly contact the admin to increase it',
      );
    }
    return this.sequelize.transaction(async (transaction) => {
      await userLeaveInstance.update({
        numberOfDaysAllowed:
          userLeaveInstance.numberOfDaysAllowed - toDeductFromDay,
      });
      return this.leaveModel.create({
        ...createLeaveDto,
        status: LeaveStatusEnum.PENDING_APPROVAL,
        deductionAmount: leaveCategory.deductionAmount,
        categoryName: leaveCategory.name,
        requesterId: user.id,
      });
    });
  }
  async approveOne(admin: User, leaveId: number) {
    const leave = await this.findOne({
      where: {
        id: leaveId,
      },
    });
    return leave.update({
      managerId: admin.id,
      status: LeaveStatusEnum.APPROVED,
    });
  }
  async rejectOne(admin: User, leaveId: number) {
    const leave = await this.findOne({
      where: {
        id: leaveId,
      },
    });
    return leave.update({
      managerId: admin.id,
      status: LeaveStatusEnum.REJECTED,
    });
  }
}

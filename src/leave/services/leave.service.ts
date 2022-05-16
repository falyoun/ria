import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Leave } from '@app/leave/models/leave.model';
import { User } from '@app/user/models/user.model';
import { CreateLeaveDto } from '@app/leave/dtos/create-leave.dto';
import { CodedException } from '@app/shared/exceptions/coded-exception';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { LeaveStatusEnum } from '@app/leave/enums/leave-status.enum';
import { RiaUtils } from '@app/shared/utils';
import { FindManyLeavesDto } from '@app/leave/dtos/find-many-leaves.dto';

@Injectable()
export class LeaveService {
  constructor(@InjectModel(Leave) private readonly leaveModel: typeof Leave) {}

  async findOne(findOptions: FindOptions<Leave>) {
    const leave = await this.leaveModel.findOne(findOptions);
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
      data: await this.leaveModel.findAll(findOptions),
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
    return this.leaveModel.create({
      ...createLeaveDto,
      status: LeaveStatusEnum.PENDING_APPROVAL,
      requesterId: user.id,
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

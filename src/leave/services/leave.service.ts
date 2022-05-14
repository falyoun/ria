import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Leave } from '@app/leave/models/leave.model';
import { User } from '@app/user/models/user.model';
import { CreateLeaveDto } from '@app/leave/dtos/create-leave.dto';
import { CodedException } from '@app/shared/exceptions/coded-exception';
import { UserService } from '@app/user/services/user.service';
import { FindOptions } from 'sequelize';
import { LeaveStatusEnum } from '@app/leave/enums/leave-status.enum';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(Leave) private readonly leaveModel: typeof Leave,
    private readonly userService: UserService,
  ) {}

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

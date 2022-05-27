import { HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CodedException } from '@app/shared/exceptions/coded-exception';
import { FindOptions, InstanceDestroyOptions, WhereOptions } from 'sequelize';
import { RiaUtils } from '@app/shared/utils';
import { FindManyLeavesDto } from '@app/leave/dtos/find-many-leaves.dto';
import { LeaveCategory } from '@app/leave/models/leave-category.model';
import { CreateLeaveCategoryDto } from '@app/leave/dtos/create-leave-category.dto';

@Injectable()
export class LeaveCategoriesService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(LeaveCategory)
    private readonly leaveCategoryModel: typeof LeaveCategory,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.leaveCategoryModel.bulkCreate([
        { deductionAmount: 100, name: 'Personal' },
        { deductionAmount: 50, name: 'University' },
        { deductionAmount: 0, name: 'Sick' },
      ]);
    } catch (e) {
      console.log('Error while bulk insert leaves categories');
    }
  }

  async findOne(findOptions: FindOptions<LeaveCategory>) {
    const leave = await this.leaveCategoryModel.findOne(findOptions);
    if (!leave) {
      throw new CodedException(
        'LEAVE_CATEGORY_NOT_FOUND',
        HttpStatus.BAD_REQUEST,
        'Leave category does not exist',
      );
    }
    return leave;
  }

  async findAll(findManyLeavesDto?: FindManyLeavesDto) {
    const whereOptions: WhereOptions<LeaveCategory> = {};
    const findOptions: FindOptions<LeaveCategory> = {
      where: whereOptions,
    };
    const count = await this.leaveCategoryModel.count(findOptions);
    RiaUtils.applyPagination(findOptions, findManyLeavesDto);
    return {
      data: await this.leaveCategoryModel.findAll(findOptions),
      count,
    };
  }
  async createOne(createLeaveDto: CreateLeaveCategoryDto) {
    return this.leaveCategoryModel.create(createLeaveDto);
  }

  async deleteOne(
    findOptions: FindOptions<LeaveCategory>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const instance = await this.findOne(findOptions);

    await instance.destroy(instanceDestroyOptions);
    return {
      message: 'deleted.!',
    };
  }
}

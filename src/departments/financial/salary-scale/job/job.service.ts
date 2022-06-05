import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from '@app/departments/financial/salary-scale/job/job.model';
import { FindOptions, InstanceDestroyOptions } from 'sequelize';
import { ResourceNotFoundException } from '@app/shared/exceptions/coded-exception';
import { CreateJobDto } from '@app/departments/financial/salary-scale/job/dtos/create-job.dto';
import { FindJobsDto } from '@app/departments/financial/salary-scale/job/dtos/find-jobs.dto';
import { RiaUtils } from '@app/shared/utils';
import { UpdateJobDto } from '@app/departments/financial/salary-scale/job/dtos/update-job.dto';
import { UserService } from '@app/user/services/user.service';
import { User } from '@app/user/models/user.model';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job) private readonly jobModel: typeof Job,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}
  createOne(createJobDto: CreateJobDto) {
    return this.jobModel.create(createJobDto);
  }
  async findJobWithUsers(findOptions: FindOptions<Job>) {
    const instance = await this.findOne(findOptions);
    console.log(instance);
    const users = await this.userModel.findAll({
      where: {
        jobId: instance.id,
      },
    });
    return {
      ...instance.toJSON(),
      users,
    };
  }
  async findOne(findOptions: FindOptions<Job>) {
    const instance = await this.jobModel
      .scope('department')
      .findOne(findOptions);
    if (!instance) {
      throw new ResourceNotFoundException('JOB');
    }
    return instance;
  }
  async findAll(findJobsDto: FindJobsDto) {
    const findOptions = {};
    const count = await this.jobModel.count(findOptions);
    RiaUtils.applyPagination(findOptions, findJobsDto);
    return {
      data: await this.jobModel.findAll(findOptions),
      count,
    };
  }
  async updateOne(findOptions: FindOptions<Job>, updateJobDto: UpdateJobDto) {
    const instance = await this.findOne(findOptions);
    return instance.update(updateJobDto);
  }
  async deleteOne(
    findOptions: FindOptions<Job>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const instance = await this.findOne(findOptions);
    await instance.destroy(instanceDestroyOptions);
    return {
      message: 'Deleted successfully.!',
    };
  }
}

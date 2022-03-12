import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from '@app/salary-scale/job/job.model';
import { FindOptions, InstanceDestroyOptions } from 'sequelize';
import { ResourceNotFoundException } from '@app/shared/exceptions/coded-exception';
import { CreateJobDto } from '@app/salary-scale/job/dtos/create-job.dto';
import { FindJobsDto } from '@app/salary-scale/job/dtos/find-jobs.dto';
import { RiaUtils } from '@app/shared/utils';
import { UpdateJobDto } from '@app/salary-scale/job/dtos/update-job.dto';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job) private readonly jobModel: typeof Job) {}
  createOne(createJobDto: CreateJobDto) {
    return this.jobModel.create(createJobDto);
  }
  async findOne(findOptions: FindOptions<Job>) {
    const instance = await this.jobModel.findOne(findOptions);
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

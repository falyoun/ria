import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SalaryScale } from '@app/departments/financial/salary-scale/models/salary-scale.model';
import { SalaryScaleJob } from '@app/departments/financial/salary-scale/models/salary-scale-job.model';
import { Sequelize } from 'sequelize-typescript';
import { CreateSalaryScaleDto } from '@app/departments/financial/salary-scale/dtos/create-salary-scale.dto';
import { FindOptions, InstanceDestroyOptions } from 'sequelize';
import {
  CodedException,
  ResourceNotFoundException,
} from '@app/shared/exceptions/coded-exception';
import { JobService } from '@app/departments/financial/salary-scale/job/job.service';
import { FindSalaryScalesDto } from '@app/departments/financial/salary-scale/dtos/find-salary-scales.dto';
import { RiaUtils } from '@app/shared/utils';

@Injectable()
export class SalaryScaleService {
  constructor(
    @InjectModel(SalaryScale)
    private readonly salaryScaleModel: typeof SalaryScale,
    @InjectModel(SalaryScaleJob)
    private readonly salaryScaleJobModel: typeof SalaryScaleJob,
    private readonly sequelize: Sequelize,
    private readonly jobService: JobService,
  ) {}

  createOne(createSalaryScaleDto: CreateSalaryScaleDto) {
    return this.sequelize.transaction(async (transaction) => {
      const activeSalaryScale = await this.salaryScaleModel.findOne({
        where: {
          isActive: true,
        },
      });
      if (activeSalaryScale) {
        await activeSalaryScale.update({
          isActive: false,
        });
      }
      const salaryScaleEntity = await this.salaryScaleModel.create({
        isActive: true,
      });
      await Promise.all(
        createSalaryScaleDto.entities.map((anEntity) => {
          this.jobService
            .findOne({
              where: {
                id: anEntity.jobId,
              },
            })
            .then((job) => {
              return this.salaryScaleJobModel.create({
                salaryScaleId: salaryScaleEntity.id,
                jobId: job.id,
                amount: anEntity.amount,
                employeeLevel: anEntity.employeeLevel,
              });
            });
        }),
      );
      return this.findOne({
        where: {
          id: salaryScaleEntity.id,
        },
        include: [SalaryScaleJob],
      });
    });
  }
  async findOne(findOptions: FindOptions<SalaryScale>) {
    const instance = await this.salaryScaleModel.findOne(findOptions);
    if (!instance) {
      throw new ResourceNotFoundException('SALARY_SCALE');
    }
    return instance;
  }
  async activateSalaryScale(id: number) {
    const salaryScale = await this.findOne({
      where: {
        id,
      },
    });
    if (salaryScale.isActive) {
      throw new CodedException(
        'SALARY_SCALE',
        HttpStatus.BAD_REQUEST,
        'Already active',
      );
    }
    const activeSalaryScale = await this.salaryScaleModel.findOne({
      where: {
        isActive: true,
      },
    });
    if (activeSalaryScale) {
      return this.sequelize.transaction(async (transaction) => {
        await activeSalaryScale.update({
          isActive: false,
        });
        return salaryScale.update({
          isActive: true,
        });
      });
    }
    return salaryScale.update({
      isActive: true,
    });
  }
  async findAll(findSalaryScalesDto: FindSalaryScalesDto) {
    const findOptions: FindOptions<SalaryScale> = {
      include: [SalaryScaleJob],
    };
    const count = await this.salaryScaleModel.count(findOptions);
    RiaUtils.applyPagination(findOptions, findSalaryScalesDto);
    return {
      data: await this.salaryScaleModel.findAll(findOptions),
      count,
    };
  }

  async deleteOne(
    findOptions: FindOptions<SalaryScale>,
    instanceDestroyOptions?: InstanceDestroyOptions,
  ) {
    const instance = await this.findOne(findOptions);
    await instance.destroy(instanceDestroyOptions);
    return {
      message: 'Deleted successfully.!',
    };
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '@app/departments/models/department.model';
import { CreateDepartmentDto } from '@app/departments/dtos/create-department.dto';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { CodedException } from '@app/shared/exceptions/coded-exception';
import { UserService } from '@app/user/services/user.service';
import { AddUsersToDepartmentDto } from '@app/departments/dtos/add-users-to-department.dto';
import { FindManyDepartmentsDto } from '@app/departments/dtos/find-many-departments.dto';
import { RiaUtils } from '@app/shared/utils';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
    private readonly userService: UserService,
  ) {}

  async findOne(findOptions: FindOptions<Department>) {
    const department = await this.departmentModel.findOne(findOptions);
    if (!department) {
      throw new CodedException(
        'DEPARTMENT_NOT_FOUND',
        HttpStatus.BAD_REQUEST,
        'Department does not exist',
      );
    }
    return department;
  }
  async findAll(findManyDepartmentsDto: FindManyDepartmentsDto) {
    let whereOptions: WhereOptions<Department> = {};
    if (findManyDepartmentsDto.title) {
      whereOptions = {
        ...whereOptions,
        title: {
          [Op.like]: `%${findManyDepartmentsDto.title}%`,
        },
      };
    }
    const findOptions: FindOptions<Department> = {
      where: whereOptions,
    };
    const count = await this.departmentModel.count(findOptions);
    RiaUtils.applyPagination(findOptions, findManyDepartmentsDto);
    return {
      data: await this.departmentModel.findAll(findOptions),
      count,
    };
  }
  createOne(createDepartmentDto: CreateDepartmentDto) {
    return this.departmentModel.create(createDepartmentDto);
  }
  async addUsersToDepartment(
    departmentId: number,
    addUsersToDepartmentDto: AddUsersToDepartmentDto,
  ) {
    await this.findOne({
      where: {
        id: departmentId,
      },
    });
    const users = await this.userService.findAll({
      where: {
        id: {
          [Op.in]: addUsersToDepartmentDto.ids,
        },
      },
    });
    if (
      !addUsersToDepartmentDto.overwrite &&
      users.find((u) => !!u.departmentId)
    ) {
      throw new CodedException(
        'USER_ALREADY_IN_DEPARTMENT',
        HttpStatus.BAD_REQUEST,
        'There is a user assigned to a department, you have to de-link him before',
      );
    }
    return Promise.all(
      users.map((u) =>
        u.update({
          departmentId: departmentId,
        }),
      ),
    );
  }
}

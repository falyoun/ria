import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { DepartmentDto } from '@app/departments/dtos/department.dto';
import { ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { RequestUser } from '@app/spa-authentication';
import { User } from '@app/user/models/user.model';
import { CreateDepartmentDto } from '@app/departments/dtos/create-department.dto';
import { DepartmentsService } from '@app/departments/services/departments.service';
import { FindManyDepartmentsDto } from '@app/departments/dtos/find-many-departments.dto';
import { AddUsersToDepartmentDto } from '@app/departments/dtos/add-users-to-department.dto';

@ApiTags('Departments')
@Controller('Departments')
@ApiExtraModels(DepartmentDto)
@UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post(':id/add-user-to-departments')
  addUsersToDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() addUsersToDepartmentDto: AddUsersToDepartmentDto,
  ) {
    return this.departmentsService.addUsersToDepartment(
      id,
      addUsersToDepartmentDto,
    );
  }

  @ApiRiaDto(DepartmentDto)
  @Post()
  createOne(
    @RequestUser() user: User,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentsService.createOne(createDepartmentDto);
  }

  @Get(':id')
  findDepartment(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne({
      where: {
        id,
      },
    });
  }

  @Get()
  findAll(@Query() findDepartmentsDto: FindManyDepartmentsDto) {
    return this.departmentsService.findAll(findDepartmentsDto);
  }
}

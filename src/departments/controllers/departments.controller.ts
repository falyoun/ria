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
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { RequestUser } from '@app/spa-authentication';
import { User } from '@app/user/models/user.model';
import { CreateDepartmentDto } from '@app/departments/dtos/create-department.dto';
import { DepartmentsService } from '@app/departments/services/departments.service';
import { FindManyDepartmentsDto } from '@app/departments/dtos/find-many-departments.dto';
import { AddUsersToDepartmentDto } from '@app/departments/dtos/add-users-to-department.dto';
import { MarkUserAsManagerForDepartmentDto } from '@app/departments/dtos/mark-user-as-manager-for-department.dto';

@ApiTags('Departments')
@Controller('departments')
@ApiExtraModels(DepartmentDto)
@UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @ApiRiaDto(DepartmentDto)
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
  @Post(':id/mark-user-as-manager')
  markUserAsManager(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MarkUserAsManagerForDepartmentDto,
  ) {
    return this.departmentsService.markUserAsManagerForADepartment(
      id,
      dto.userId,
    );
  }

  @ApiRiaDto(DepartmentDto)
  @Post()
  createOne(
    @RequestUser() user: User,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentsService.createOne(user, createDepartmentDto);
  }

  @ApiRiaDto(DepartmentDto)
  @Get(':id')
  findDepartment(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne({
      where: {
        id,
      },
    });
  }

  @ApiPaginatedDto(DepartmentDto)
  @Get()
  findAll(@Query() findDepartmentsDto: FindManyDepartmentsDto) {
    return this.departmentsService.findAll(findDepartmentsDto);
  }
}

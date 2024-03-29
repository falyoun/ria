import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SalaryScaleService } from '@app/departments/financial/salary-scale/salary-scale.service';
import { SalaryScaleDto } from '@app/departments/financial/salary-scale/dtos/salary-scale.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { MessageResponseDto } from '@app/shared/dtos/message-response.dto';
import { CreateSalaryScaleDto } from '@app/departments/financial/salary-scale/dtos/create-salary-scale.dto';
import { FindSalaryScalesDto } from '@app/departments/financial/salary-scale/dtos/find-salary-scales.dto';
import { SalaryScaleJob } from '@app/departments/financial/salary-scale/models/salary-scale-job.model';

@ApiExtraModels(SalaryScaleDto, MessageResponseDto)
@ApiTags('Salary Scale')
@Controller('salary-scales')
export class SalaryScaleController {
  constructor(private readonly salaryScaleService: SalaryScaleService) {}

  @UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
  @ApiRiaDto(SalaryScaleDto)
  @Post()
  createSalaryScale(@Body() createSalaryScaleDto: CreateSalaryScaleDto) {
    return this.salaryScaleService.createOne(createSalaryScaleDto);
  }

  @UseGuards(
    RoleGuard(
      AppRole.SUPER_ADMIN,
      AppRole.ADMIN,
      AppRole.HR_MANAGER,
      AppRole.MANAGER,
    ),
  )
  @ApiRiaDto(SalaryScaleDto)
  @Get(':id')
  getSalaryScale(@Param('id', ParseIntPipe) id: number) {
    return this.salaryScaleService.findOne({
      where: {
        id,
      },
      include: [SalaryScaleJob],
    });
  }

  @UseGuards(
    RoleGuard(
      AppRole.SUPER_ADMIN,
      AppRole.ADMIN,
      AppRole.HR_MANAGER,
      AppRole.MANAGER,
    ),
  )
  @ApiPaginatedDto(SalaryScaleDto)
  @Get()
  getSalaryScales(@Query() findSalaryScalesDto: FindSalaryScalesDto) {
    return this.salaryScaleService.findAll(findSalaryScalesDto);
  }

  @UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
  @ApiRiaDto(MessageResponseDto)
  @Delete(':id')
  deleteSalaryScale(@Param('id', ParseIntPipe) id: number) {
    return this.salaryScaleService.deleteOne(
      {
        where: {
          id,
        },
      },
      {
        force: true,
      },
    );
  }

  @ApiRiaDto(SalaryScaleDto)
  @Patch(':id/activate')
  activateSalaryScale(@Param('id', ParseIntPipe) id: number) {
    return this.salaryScaleService.activateSalaryScale(id);
  }
}

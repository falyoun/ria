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
import { SalaryScaleService } from '@app/salary-scale/salary-scale.service';
import { SalaryScaleDto } from '@app/salary-scale/dtos/salary-scale.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { MessageResponseDto } from '@app/shared/dtos/message-response.dto';
import { CreateSalaryScaleDto } from '@app/salary-scale/dtos/create-salary-scale.dto';
import { FindSalaryScalesDto } from '@app/salary-scale/dtos/find-salary-scales.dto';
import { SalaryScaleJob } from '@app/salary-scale/models/salary-scale-job.model';

@ApiExtraModels(SalaryScaleDto, MessageResponseDto)
@ApiTags('Salary Scale')
@UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER))
@Controller('salary-scales')
export class SalaryScaleController {
  constructor(private readonly salaryScaleService: SalaryScaleService) {}

  @ApiRiaDto(SalaryScaleDto)
  @Post()
  createSalaryScale(@Body() createSalaryScaleDto: CreateSalaryScaleDto) {
    return this.salaryScaleService.createOne(createSalaryScaleDto);
  }

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

  @ApiPaginatedDto(SalaryScaleDto)
  @Get()
  getSalaryScales(@Query() findSalaryScalesDto: FindSalaryScalesDto) {
    return this.salaryScaleService.findAll(findSalaryScalesDto);
  }

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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JobDto } from '@app/departments/financial/salary-scale/job/dtos/job.dto';
import { JobService } from '@app/departments/financial/salary-scale/job/job.service';
import { CreateJobDto } from '@app/departments/financial/salary-scale/job/dtos/create-job.dto';
import { FindJobsDto } from '@app/departments/financial/salary-scale/job/dtos/find-jobs.dto';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { UpdateJobDto } from '@app/departments/financial/salary-scale/job/dtos/update-job.dto';
import { MessageResponseDto } from '@app/shared/dtos/message-response.dto';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';

@ApiExtraModels(JobDto, MessageResponseDto)
@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
  @ApiRiaDto(JobDto)
  @Post()
  createOne(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createOne(createJobDto);
  }

  @UseGuards(
    RoleGuard(
      AppRole.SUPER_ADMIN,
      AppRole.ADMIN,
      AppRole.HR_MANAGER,
      AppRole.MANAGER,
      AppRole.USER,
    ),
  )
  @ApiRiaDto(JobDto)
  @Get(':id')
  findJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findJobWithUsers({
      where: {
        id,
      },
    });
  }

  @UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
  @ApiRiaDto(JobDto)
  @Put(':id')
  updateJob(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobService.updateOne(
      {
        where: {
          id,
        },
      },
      updateJobDto,
    );
  }

  @UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
  @ApiRiaDto(MessageResponseDto)
  @Delete(':id')
  deleteJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteOne(
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

  @UseGuards(
    RoleGuard(
      AppRole.SUPER_ADMIN,
      AppRole.ADMIN,
      AppRole.HR_MANAGER,
      AppRole.MANAGER,
    ),
  )
  @ApiPaginatedDto(JobDto)
  @Get()
  findJobs(@Query() findJobsDto: FindJobsDto) {
    return this.jobService.findAll(findJobsDto);
  }
}

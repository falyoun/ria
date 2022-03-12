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
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JobDto } from '@app/salary-scale/job/dtos/job.dto';
import { JobService } from '@app/salary-scale/job/job.service';
import { CreateJobDto } from '@app/salary-scale/job/dtos/create-job.dto';
import { FindJobsDto } from '@app/salary-scale/job/dtos/find-jobs.dto';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { UpdateJobDto } from '@app/salary-scale/job/dtos/update-job.dto';
import { MessageResponseDto } from '@app/shared/dtos/message-response.dto';

@ApiExtraModels(JobDto, MessageResponseDto)
@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiRiaDto(JobDto)
  @Post()
  createOne(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createOne(createJobDto);
  }

  @ApiRiaDto(JobDto)
  @Get(':id')
  findJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne({
      where: {
        id,
      },
    });
  }

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

  @ApiPaginatedDto(JobDto)
  @Get()
  findJobs(@Query() findJobsDto: FindJobsDto) {
    return this.jobService.findAll(findJobsDto);
  }
}

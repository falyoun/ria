import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { LeaveDto } from '@app/leave/dtos/leave.dto';
import { CreateLeaveDto } from '@app/leave/dtos/create-leave.dto';
import { RequestUser } from '@app/spa-authentication';
import { User } from '@app/user/models/user.model';
import { LeaveService } from '@app/leave/services/leave.service';
import { FindManyLeavesDto } from '@app/leave/dtos/find-many-leaves.dto';

@ApiTags('Leaves')
@Controller('leaves')
@UseGuards(
  RoleGuard(
    AppRole.SUPER_ADMIN,
    AppRole.ADMIN,
    AppRole.HR_MANAGER,
    AppRole.MANAGER,
    AppRole.USER,
  ),
)
@ApiExtraModels(LeaveDto)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}
  @ApiRiaDto(LeaveDto)
  @Post()
  requestALeave(
    @Body() createLeaveDto: CreateLeaveDto,
    @RequestUser() user: User,
  ) {
    return this.leaveService.createOne(user, createLeaveDto);
  }

  @ApiRiaDto(LeaveDto)
  @Patch(':id/approve')
  approveLeave(
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.leaveService.approveOne(user, id);
  }

  @ApiRiaDto(LeaveDto)
  @Patch(':id/reject')
  rejectOne(@RequestUser() admin: User, @Param('id', ParseIntPipe) id: number) {
    return this.leaveService.rejectOne(admin, id);
  }

  @Get(':id')
  @ApiRiaDto(LeaveDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaveService.findOne({
      where: {
        id,
      },
    });
  }

  @Get()
  @ApiPaginatedDto(LeaveDto)
  findAll(@Query() findLeavesDto?: FindManyLeavesDto) {
    return this.leaveService.findAll(findLeavesDto);
  }
}

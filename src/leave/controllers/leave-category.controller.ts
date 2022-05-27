import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { CreateLeaveCategoryDto } from '@app/leave/dtos/create-leave-category.dto';
import { LeaveCategoriesService } from '@app/leave/services/leave-categories.service';
import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';
import { LeaveCategoryDto } from '@app/leave/dtos/leave-category.dto';
import { MessageResponseDto } from '@app/shared/dtos/message-response.dto';

@ApiTags('Leaves Categories')
@Controller('leaves-categories')
@UseGuards(RoleGuard(AppRole.SUPER_ADMIN, AppRole.ADMIN))
@ApiExtraModels(CreateLeaveCategoryDto, LeaveCategoryDto)
export class LeaveCategoryController {
  constructor(private readonly leaveCategoryService: LeaveCategoriesService) {}

  @ApiRiaDto(CreateLeaveCategoryDto)
  @Post()
  createCategory(@Body() createLeaveCategoryDto: CreateLeaveCategoryDto) {
    return this.leaveCategoryService.createOne(createLeaveCategoryDto);
  }

  @Get(':id')
  @ApiRiaDto(LeaveCategoryDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaveCategoryService.findOne({
      where: {
        id,
      },
    });
  }
  @Delete(':id')
  @ApiRiaDto(MessageResponseDto)
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaveCategoryService.deleteOne(
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

  @Get()
  @ApiPaginatedDto(LeaveCategoryDto)
  findAll(@Query() findLeavesDto?: SequelizePaginationDto) {
    return this.leaveCategoryService.findAll(findLeavesDto);
  }
}

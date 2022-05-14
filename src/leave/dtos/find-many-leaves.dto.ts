import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';
import { IsArray, IsOptional } from 'class-validator';

export class FindManyLeavesDto extends SequelizePaginationDto {
  @IsArray()
  @IsOptional()
  ids?: number[];
}

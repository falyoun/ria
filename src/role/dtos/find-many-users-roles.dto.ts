import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';
import { IsArray, IsOptional } from 'class-validator';

export class FindManyUsersRolesDto extends SequelizePaginationDto {
  @IsArray()
  @IsOptional()
  userIds?: number[];
}

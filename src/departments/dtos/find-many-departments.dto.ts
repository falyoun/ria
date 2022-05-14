import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class FindManyDepartmentsDto extends SequelizePaginationDto {
  @IsString()
  @IsOptional()
  title?: string;
}

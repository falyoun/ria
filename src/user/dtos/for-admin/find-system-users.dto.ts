import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';

export class FindSystemUsersDto extends SequelizePaginationDto {
  @IsString()
  @IsOptional()
  email?: string;
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

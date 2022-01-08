import { SequelizePaginationDto } from '@app/shared';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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

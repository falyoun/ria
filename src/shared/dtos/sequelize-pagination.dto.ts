import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class SequelizePaginationDto {
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  limit?: number;
  @Transform(({ value }) => +value)
  @IsOptional()
  page?: number;
}

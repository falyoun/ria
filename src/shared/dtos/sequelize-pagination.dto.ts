import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SequelizePaginationDto {
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @Min(0)
  limit?: number;
  @Transform(({ value }) => +value)
  @IsOptional()
  @Min(0)
  page?: number;
}

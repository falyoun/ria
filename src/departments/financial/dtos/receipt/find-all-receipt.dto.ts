import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';

export class FindAllReceiptDto extends SequelizePaginationDto {
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(0)
  salaryLow?: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsPositive()
  salaryHigh?: number;

  @IsEmail()
  @IsOptional()
  email?: string;
}

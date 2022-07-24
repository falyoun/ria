import { IsOptional, IsString } from 'class-validator';
import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';

export class GetManyBeneficiariesMobileDto extends SequelizePaginationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  iban?: string;
}

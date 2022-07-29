import { IsOptional, IsPositive, IsString } from 'class-validator';
import { OmitType } from '@nestjs/swagger';

export class DataBoxDto {
  @IsPositive()
  invoiceId: number;
  @IsString()
  @IsOptional()
  key: string;
  @IsString()
  @IsOptional()
  value: string;
}

export class CreateDataBoxDto extends OmitType(DataBoxDto, ['invoiceId']) {}

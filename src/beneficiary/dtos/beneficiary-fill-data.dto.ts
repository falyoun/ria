import { IsOptional, IsString } from 'class-validator';

export class BeneficiaryFillDataDto {
  @IsOptional()
  @IsString()
  bankNumber?: string;

  @IsOptional()
  @IsString()
  swift?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;
}

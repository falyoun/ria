import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BeneficiaryTypeEnum } from '@app/beneficiary/models/beneficiary.model';

export class CreateBeneficiaryDto {
  @IsString()
  @MaxLength(20)
  name: string;
  @IsString()
  swiftCode: string;
  @IsString()
  bankName: string;
  @IsOptional()
  @IsString()
  accountNumber?: string;
  @IsString()
  iban: string;
  @IsString()
  branchName: string;
  @IsString()
  branchAddress: string;
  @IsString()
  taxNumber: string;
  @IsString()
  currencyCode: string;
  @IsNumber()
  @IsOptional()
  coolDownTimestamp?: number;
  @IsNumber()
  @IsOptional()
  syncedAt?: number;
  @IsEnum(BeneficiaryTypeEnum)
  type: BeneficiaryTypeEnum;

  @IsString()
  @IsOptional()
  clearanceCode?: string;
  @IsString()
  @IsOptional()
  branchCode?: string;
  @IsString()
  @IsOptional()
  bankCode?: string;
}

import { Allow } from 'class-validator';
import { BeneficiaryStatus } from '@app/beneficiary/enums/beneficiary-status.enum';
import { BeneficiaryTypeEnum } from '@app/beneficiary/models/beneficiary.model';

export class BeneficiaryDto {
  @Allow()
  id?: number;
  @Allow()
  organizationId?: number;
  @Allow()
  name?: string;
  @Allow()
  swiftCode?: string;
  @Allow()
  bankName?: string;
  @Allow()
  iban?: string;
  @Allow()
  accountNumber?: string;
  @Allow()
  branchName?: string;
  @Allow()
  branchAddress?: string;
  @Allow()
  taxNumber?: string;
  @Allow()
  status?: BeneficiaryStatus;
  @Allow()
  currencyCode?: string;
  @Allow()
  address?: string;
  @Allow()
  type?: BeneficiaryTypeEnum;
  @Allow()
  countryCode?: string;
  @Allow()
  countryName?: string;
  @Allow()
  coolDownTimestamp?: number;
  @Allow()
  frozenFor24Hours?: boolean;
  @Allow()
  syncedAt?: number;
  @Allow()
  clearanceCode?: string;
  @Allow()
  branchCode?: string;
  @Allow()
  bankCode?: string;
}

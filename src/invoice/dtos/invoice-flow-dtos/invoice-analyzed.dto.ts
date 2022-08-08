import { InvoiceStatusEnum } from '@app/invoice/enums/invoice-status.enum';
import { IsEnum, IsPositive } from 'class-validator';

export class InvoiceAnalyzedDto {
  @IsPositive()
  invoiceId: number;
  @IsPositive()
  userId: number;
  @IsEnum(InvoiceStatusEnum)
  status: InvoiceStatusEnum;
}

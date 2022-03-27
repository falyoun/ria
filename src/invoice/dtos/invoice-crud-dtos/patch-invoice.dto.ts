import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceDto } from '@app/invoice/dtos/invoice-crud-dtos/create-invoice.dto';

export class PatchInvoiceDto extends PartialType(CreateInvoiceDto) {}

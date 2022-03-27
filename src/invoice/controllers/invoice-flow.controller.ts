import { Controller, Post } from '@nestjs/common';
import { InvoiceFlowService } from '@app/invoice/services/invoice-flow.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from '@app/invoice/dtos/invoice.dto';
@ApiExtraModels(InvoiceDto)
@Controller('/invoices/flow')
@ApiTags('Invoice Flow')
export class InvoiceFlowController {
  constructor(private readonly invoiceFlowService: InvoiceFlowService) {}
  @Post('review')
  reviewOne() {}
  @Post('approve')
  approveOne() {}
}

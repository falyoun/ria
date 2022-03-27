import { Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { InvoiceCrudService } from '@app/invoice/services/invoice-crud.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from '@app/invoice/dtos/invoice.dto';

@ApiExtraModels(InvoiceDto)
@Controller('/invoices/cruds')
@ApiTags('Invoice CRUDs')
export class InvoiceCrudController {
  constructor(private readonly invoiceCrudService: InvoiceCrudService) {}
  @Post()
  createOne() {}
  @Get(':id')
  getOne() {}
  @Get()
  getMany() {}
  @Patch(':id')
  patchOne() {}
  @Put(':id')
  replaceOne() {}
}

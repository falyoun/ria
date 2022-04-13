import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InvoiceCrudService } from '@app/invoice/services/invoice-crud.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from '@app/invoice/dtos/invoice.dto';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { pathToUploadedInvoices } from '@app/global/app-file/constants';
import { editFileName, fileFilter } from '@app/global/app-file/utils';
import { RequestUser } from '@app/spa-authentication';
import { User } from '@app/user/models/user.model';
import { AppFile } from '@app/global/app-file/models/app-file.model';
import { GetManyInvoicesDto } from '@app/invoice/dtos/invoice-crud-dtos/get-many-invoices.dto';
import { CodedException } from '@app/shared/exceptions/coded-exception';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { Request } from 'express';
import { CreateInvoiceDto } from '@app/invoice/dtos/invoice-crud-dtos/create-invoice.dto';

@UseGuards(
  RoleGuard(
    AppRole.SUPER_ADMIN,
    AppRole.ADMIN,
    AppRole.HR_MANAGER,
    AppRole.MANAGER,
    AppRole.USER,
  ),
)
@ApiExtraModels(InvoiceDto)
@Controller('/invoices/cruds')
@ApiTags('Invoice CRUDs')
export class InvoiceCrudController {
  constructor(private readonly invoiceCrudService: InvoiceCrudService) {}
  @Post()
  @ApiRiaDto(InvoiceDto)
  @UseInterceptors(
    FileInterceptor('invoice', {
      storage: diskStorage({
        destination: pathToUploadedInvoices,
        filename: editFileName,
      }),
      limits: {
        fieldSize: 25000000,
      },
      fileFilter: fileFilter(/\.(PDF|pdf)$/),
    }),
  )
  createOne(
    @RequestUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    if (!file) {
      throw new CodedException(
        'NO_FILE_PRESENTED',
        HttpStatus.BAD_REQUEST,
        'You should provide invoice file as pdf file',
      );
    }
    return this.invoiceCrudService.createOne(user, file, createInvoiceDto);
  }
  @ApiRiaDto(InvoiceDto)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceCrudService.findOne({
      where: {
        id,
      },
      include: [AppFile],
    });
  }

  @ApiPaginatedDto(InvoiceDto)
  @Get()
  getMany(@Query() query: GetManyInvoicesDto) {
    return this.invoiceCrudService.findAll(query);
  }
  @Patch(':id')
  patchOne() {}
  @Put(':id')
  replaceOne() {}
}

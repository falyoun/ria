import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InvoiceCrudService } from '@app/invoice/services/invoice-crud.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from '@app/invoice/dtos/invoice.dto';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { pathToUploadedAvatars } from '@app/global/app-file/constants';
import { editFileName, imageFileFilter } from '@app/global/app-file/utils';
import { RequestUser } from '@app/spa-authentication';
import { User } from '@app/user/models/user.model';
import { AppFile } from '@app/global/app-file/models/app-file.model';
import { GetManyInvoicesDto } from '@app/invoice/dtos/invoice-crud-dtos/get-many-invoices.dto';

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
        destination: pathToUploadedAvatars,
        filename: editFileName,
      }),
      limits: {
        fieldSize: 25000000,
      },
      fileFilter: imageFileFilter,
    }),
  )
  createOne(
    @RequestUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.invoiceCrudService.createOne(user, file);
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

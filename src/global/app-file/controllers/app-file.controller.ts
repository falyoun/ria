import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { pathToUploadedAvatars } from '../constants';
import { editFileName, imageFileFilter } from '../utils';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { AppFileDto } from '@app/global/app-file/dtos/app-file.dto';
import { AppFileService } from '@app/global/app-file/services/app-file.service';
import { ApiRiaDto } from '@app/shared/dtos/ria-response.dto';

@UseGuards(
  RoleGuard(
    AppRole.SUPER_ADMIN,
    AppRole.ADMIN,
    AppRole.HR_MANAGER,
    AppRole.USER,
    AppRole.MANAGER,
  ),
)
@ApiTags('App files')
@ApiExtraModels(AppFileDto)
@Controller('app-files')
export class AppFileController {
  constructor(private readonly appFileService: AppFileService) {}
  @Post()
  @ApiRiaDto(AppFileDto)
  @UseInterceptors(
    FileInterceptor('avatar', {
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
  createOne(@UploadedFile() file: Express.Multer.File) {
    console.log(
      `Uploading file: ${file.filename} || original name: ${file.originalname}`,
    );
    return this.appFileService.createFile({
      mimetype: file.mimetype,
      path: file.path,
      filename: file.filename,
    });
  }
  @ApiRiaDto(AppFileDto)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appFileService.getFile({
      where: {
        id,
      },
    });
  }
}

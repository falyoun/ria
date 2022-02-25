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
import { AppFileService } from '../services';
import { AppRole, RoleGuard } from '@app/role';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AppFileDto } from '../dtos';
import { ApiRiaDto } from '@app/shared';
import { pathToUploadedAvatars } from '../constants';
import { editFileName, imageFileFilter } from '../utils';

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
        fieldSize: 25,
      },
      fileFilter: imageFileFilter,
    }),
  )
  createOne(@UploadedFile() file: Express.Multer.File) {
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

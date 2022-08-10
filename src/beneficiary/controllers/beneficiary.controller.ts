import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Beneficiary } from '../models/beneficiary.model';
import { RoleGuard } from '@app/role/guards/role.guard';
import { BeneficiaryService } from '../services/beneficiary.service';
import { CreateBeneficiaryDto } from '../dtos/create-beneficiary.dto';
import { CrudWrapperInterceptor } from '@app/shared/interceptors/crud-wrapper.interceptor';
import { AppRole } from '@app/role/enums/app-role.enum';
import { ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { BeneficiaryFillDataDto } from '@app/beneficiary/dtos/beneficiary-fill-data.dto';
import { BeneficiaryDto } from '@app/beneficiary/dtos/beneficiary.dto';
@Crud({
  model: {
    type: Beneficiary,
  },
  query: {
    alwaysPaginate: false,
  },
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
    createOneBase: {
      interceptors: [CrudWrapperInterceptor],
    },
    updateOneBase: {
      interceptors: [CrudWrapperInterceptor],
    },
    deleteOneBase: {
      interceptors: [CrudWrapperInterceptor],
    },
  },
})
@CrudAuth({})
@ApiTags('Beneficiary Account')
@Controller('beneficiaries')
export class BeneficiaryController implements CrudController<Beneficiary> {
  constructor(public service: BeneficiaryService) {}

  @Override()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(
    RoleGuard(
      AppRole.ADMIN,
      AppRole.MANAGER,
      AppRole.USER,
      AppRole.SUPER_ADMIN,
      AppRole.HR_MANAGER,
    ),
  )
  async createOne(@Body() dto: CreateBeneficiaryDto): Promise<void> {
    await this.service.createBeneficiary(dto);
  }

  /**
   *
   * @Description: This endpoint is required whenever the user fills in an iban or swift
   * this will grab & return more data
   * */
  @Get('fill-data')
  @Override()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(
    RoleGuard(
      AppRole.ADMIN,
      AppRole.MANAGER,
      AppRole.USER,
      AppRole.SUPER_ADMIN,
      AppRole.HR_MANAGER,
    ),
  )
  @ApiRiaDto(BeneficiaryDto)
  fillData(@Query() query: BeneficiaryFillDataDto) {
    return this.service.fillData(query);
  }
  @Override()
  @UseGuards(
    RoleGuard(
      AppRole.ADMIN,
      AppRole.MANAGER,
      AppRole.USER,
      AppRole.SUPER_ADMIN,
      AppRole.HR_MANAGER,
    ),
  )
  @ApiRiaDto(BeneficiaryDto)
  async getMany(@ParsedRequest() req: CrudRequest) {
    const beneficiaries: Beneficiary[] = await this.service.getMany(req);
    return {
      data: beneficiaries.map((beneficiaryAccount) =>
        beneficiaryAccount.toJSON(),
      ),
    };
  }

  @Override()
  @UseGuards(
    RoleGuard(
      AppRole.ADMIN,
      AppRole.MANAGER,
      AppRole.USER,
      AppRole.SUPER_ADMIN,
      AppRole.HR_MANAGER,
    ),
  )
  @ApiRiaDto(BeneficiaryDto)
  async getOne(@ParsedRequest() req: CrudRequest) {
    return { data: {} };
  }

  @Override()
  @UseGuards(
    RoleGuard(
      AppRole.ADMIN,
      AppRole.MANAGER,
      AppRole.USER,
      AppRole.SUPER_ADMIN,
      AppRole.HR_MANAGER,
    ),
  )
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    dto: BeneficiaryDto,
  ): Promise<Beneficiary> {
    if (dto.name && dto.name.length > 20) {
      dto.name = dto.name.substring(0, 20);
    }
    if (dto.swiftCode && dto.swiftCode.endsWith('XXX')) {
      dto.swiftCode = dto.swiftCode.substring(0, dto.swiftCode.length - 3);
    }
    return this.updateOne(req, dto);
  }

  @Override()
  @UseGuards(
    RoleGuard(
      AppRole.ADMIN,
      AppRole.MANAGER,
      AppRole.USER,
      AppRole.SUPER_ADMIN,
      AppRole.HR_MANAGER,
    ),
  )
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
  ): Promise<void | Beneficiary> {
    return this.deleteOne(req);
  }
}

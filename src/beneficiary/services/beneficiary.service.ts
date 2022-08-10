import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AlphaSequelizeCrudService } from 'alpha-nestjsx-crud';
import {
  Beneficiary,
  BeneficiaryCreationAttributes,
} from '../models/beneficiary.model';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { CreateBeneficiaryDto } from '../dtos/create-beneficiary.dto';
import { BeneficiaryNotFoundException } from '../exceptions/exceptions';
import { BeneficiaryStatus } from '@app/beneficiary/enums/beneficiary-status.enum';
import {
  IbanBaseResponse,
  SwiftBaseResponse,
  SwiftcodesapiService,
} from 'alpha-swiftcodesapi';
import { GetManyBeneficiariesMobileDto } from '@app/beneficiary/dtos/get-many-beneficiaries-mobile.dto';
import { BeneficiaryFillDataDto } from '@app/beneficiary/dtos/beneficiary-fill-data.dto';
import { RiaUtils } from '@app/shared/utils';
import { BeneficiaryDto } from '@app/beneficiary/dtos/beneficiary.dto';

@Injectable()
export class BeneficiaryService
  extends AlphaSequelizeCrudService<Beneficiary>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(Beneficiary)
    private readonly beneficiaryAccountModel: typeof Beneficiary,
    private readonly swiftcodesapiService: SwiftcodesapiService,
  ) {
    super(beneficiaryAccountModel);
  }

  onApplicationBootstrap() {
    // try {
    //   this.beneficiaryAccountModel
    //     .bulkCreate([
    //       {
    //         iban: 'AE1234567765',
    //         bankCode: 'AE',
    //         bankName: 'ENBD',
    //         swiftCode: 'AKEWDSW',
    //         countryName: 'UAE',
    //         status: BeneficiaryStatus.APPROVED,
    //       },
    //       {
    //         iban: 'AE1234567765',
    //         bankCode: 'AE',
    //         bankName: 'ENBD',
    //         swiftCode: 'AKEWDSW',
    //         countryName: 'UAE',
    //         status: BeneficiaryStatus.APPROVED,
    //       },
    //       {
    //         iban: 'AE1234567765',
    //         bankCode: 'AE',
    //         bankName: 'ENBD',
    //         swiftCode: 'AKEWDSW',
    //         countryName: 'UAE',
    //         status: BeneficiaryStatus.APPROVED,
    //       },
    //       {
    //         iban: 'AE1234567765',
    //         bankCode: 'AE',
    //         bankName: 'ENBD',
    //         swiftCode: 'AKEWDSW',
    //         countryName: 'UAE',
    //         status: BeneficiaryStatus.IN_PROGRESS,
    //       },
    //       {
    //         iban: 'AE1234567765',
    //         bankCode: 'AE',
    //         bankName: 'ENBD',
    //         swiftCode: 'AKEWDSW',
    //         countryName: 'UAE',
    //         status: BeneficiaryStatus.IN_PROGRESS,
    //       },
    //     ])
    //     .then();
    // } catch (e) {
    //   console.log('e: ', e);
    // }
  }

  async getBeneficiariesForMobile(
    getManyBeneficiariesMobileDto: GetManyBeneficiariesMobileDto,
  ) {
    let whereOptions: WhereOptions<Beneficiary> = {};
    if (getManyBeneficiariesMobileDto.name) {
      whereOptions = {
        ...whereOptions,
        name: {
          [Op.like]: `%${getManyBeneficiariesMobileDto.name}%`,
        },
      };
    }

    if (getManyBeneficiariesMobileDto.iban) {
      whereOptions = {
        ...whereOptions,
        iban: {
          [Op.like]: `%${getManyBeneficiariesMobileDto.iban}%`,
        },
      };
    }
    const findOptions: FindOptions<Beneficiary> = {
      where: whereOptions,
    };
    const count = await this.beneficiaryAccountModel.count(findOptions);
    RiaUtils.applyPagination(findOptions, getManyBeneficiariesMobileDto);
    return {
      data: await this.beneficiaryAccountModel.findAll(findOptions),
      count,
    };
  }
  async findAndUpdateEntityOrInsertANewOne(
    findOptions: FindOptions<Beneficiary>,
    beneficiaryCreationAttributes: BeneficiaryCreationAttributes,
  ) {
    const beneficiaryAccount = await this.beneficiaryAccountModel.findOne(
      findOptions,
    );
    if (!beneficiaryAccount) {
      return this.beneficiaryAccountModel.create(beneficiaryCreationAttributes);
    }
    if (beneficiaryAccount.status === BeneficiaryStatus.IN_PROGRESS) {
      const now = Date.now();
      const { coolDownTimestamp } = beneficiaryAccount;
      if (coolDownTimestamp && now - coolDownTimestamp <= 0) {
        return;
      }
      return beneficiaryAccount.update(beneficiaryCreationAttributes);
    }
    return beneficiaryAccount.update(beneficiaryCreationAttributes);
  }
  async findBeneficiary(findOptions?: FindOptions<Beneficiary>) {
    return this.beneficiaryAccountModel.findOne(findOptions);
  }
  async findOneOrThrow(findOptions?: FindOptions<Beneficiary>) {
    const instance = await this.beneficiaryAccountModel.findOne(findOptions);
    if (!instance) {
      throw new BeneficiaryNotFoundException();
    }
    return instance;
  }

  findAll(findOptions: FindOptions<Beneficiary>): Promise<Beneficiary[]> {
    return this.beneficiaryAccountModel.findAll(findOptions);
  }

  static extractValuesFromSwiftCodesApi(
    response: IbanBaseResponse | SwiftBaseResponse,
    extractor: 'iban' | 'swift',
  ) {
    const beneficiaryDto: BeneficiaryDto = {
      name: '',
      clearanceCode: '',
    };
    if (extractor === 'iban') {
      const { data } = response as IbanBaseResponse;
      beneficiaryDto['iban'] = data.id;
      beneficiaryDto['accountNumber'] = data.account_number;
      if (data.country) {
        beneficiaryDto['countryCode'] = data.country.id;
      }
      if (data.swift) {
        const { swift } = data;
        if (swift.bank) {
          beneficiaryDto['bankCode'] = swift.bank.code;
          beneficiaryDto['bankName'] = swift.bank.name;
        }
        beneficiaryDto['branchCode'] = swift.branch_code;
        beneficiaryDto['branchAddress'] = data.swift.address;
      }
    }
    if (extractor === 'swift') {
      const { data } = response as SwiftBaseResponse;
      beneficiaryDto['swiftCode'] = data.id;
      if (data.country) {
        beneficiaryDto['countryCode'] = data.country.id;
      }
      if (data.bank) {
        beneficiaryDto['bankCode'] = data.bank.code;
        beneficiaryDto['bankName'] = data.bank.name;
      }
      beneficiaryDto['branchCode'] = data.branch_code;
      beneficiaryDto['branchAddress'] = data.address;
    }
    return beneficiaryDto;
  }
  async fillData(
    beneficiaryFillDataDto: BeneficiaryFillDataDto,
  ): Promise<{ data: BeneficiaryDto | Beneficiary | null }> {
    if (beneficiaryFillDataDto.bankNumber) {
      const inDbBeneficiary = await this.beneficiaryAccountModel.findOne({
        where: {
          iban: beneficiaryFillDataDto.bankNumber,
        },
      });
      if (inDbBeneficiary) return { data: inDbBeneficiary };
      try {
        const { data } = await this.swiftcodesapiService.validateIBAN({
          iban: beneficiaryFillDataDto.bankNumber,
        });
        return {
          data: BeneficiaryService.extractValuesFromSwiftCodesApi(
            data as IbanBaseResponse,
            'iban',
          ),
        };
      } catch (e) {
        return { data: {} };
      }
    }
    if (beneficiaryFillDataDto.swift) {
      let inDbBeneficiary: Beneficiary;
      if (beneficiaryFillDataDto.accountNumber) {
        inDbBeneficiary = await this.beneficiaryAccountModel.findOne({
          where: {
            swiftCode: beneficiaryFillDataDto.swift,
            accountNumber: beneficiaryFillDataDto.accountNumber,
          },
        });
        if (inDbBeneficiary) return { data: inDbBeneficiary };
      }
      try {
        const { data } = await this.swiftcodesapiService.validateSwift({
          swift: beneficiaryFillDataDto.swift,
        });
        return {
          data: BeneficiaryService.extractValuesFromSwiftCodesApi(
            data as SwiftBaseResponse,
            'swift',
          ),
        };
      } catch (e) {
        return { data: {} };
      }
    }
  }
  async createBeneficiary(
    createBeneficiaryDto: CreateBeneficiaryDto,
  ): Promise<Beneficiary> {
    if (
      createBeneficiaryDto.swiftCode &&
      createBeneficiaryDto.swiftCode.endsWith('XXX')
    ) {
      createBeneficiaryDto.swiftCode = createBeneficiaryDto.swiftCode.substring(
        0,
        createBeneficiaryDto.swiftCode.length - 3,
      );
    }
    const beneficiary = await this.findBeneficiary({
      where: {
        iban: createBeneficiaryDto.iban,
      },
    });
    if (beneficiary) {
      return beneficiary;
    }
    return this.beneficiaryAccountModel.create({
      ...createBeneficiaryDto,
    });
  }
}

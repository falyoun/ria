import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { BeneficiaryStatus } from '@app/beneficiary/enums/beneficiary-status.enum';
export enum BeneficiaryTypeEnum {
  SAME = 'same',
  LOCAL = 'local',
  INTL = 'intl',
}

export interface BeneficiaryAttributes {
  id: number;
  name?: string;
  swiftCode?: string;
  bankName?: string;
  iban?: string;
  accountNumber?: string;
  branchName?: string;
  branchAddress?: string;
  status?: BeneficiaryStatus;
  currencyCode?: string;
  address?: string;
  type?: BeneficiaryTypeEnum;
  countryCode?: string;
  countryName?: string;
  coolDownTimestamp?: number;
  frozenFor24Hours?: boolean;
  syncedAt?: number;
  clearanceCode?: string;
  branchCode?: string;
  bankCode?: string;
}
export type BeneficiaryCreationAttributes = Optional<
  BeneficiaryAttributes,
  'id'
>;

@Table
export class Beneficiary
  extends Model<BeneficiaryAttributes, BeneficiaryCreationAttributes>
  implements BeneficiaryAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.BIGINT,
  })
  coolDownTimestamp: number;
  @Column({
    type: DataType.BIGINT,
  })
  syncedAt: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  swiftCode: string;

  @Column({
    type: DataType.STRING,
  })
  bankName: string;

  @Column({
    type: DataType.STRING,
  })
  accountNumber: string;

  @Column({
    type: DataType.STRING,
  })
  iban: string;

  @Column({
    type: DataType.STRING,
  })
  branchName: string;

  @Column({
    type: DataType.STRING,
  })
  branchAddress: string;

  @Column({
    type: DataType.ENUM(...Object.values(BeneficiaryStatus)),
    defaultValue: BeneficiaryStatus.INACTIVE,
  })
  status: BeneficiaryStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  currencyCode: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.ENUM(...Object.values(BeneficiaryTypeEnum)),
  })
  type: BeneficiaryTypeEnum;

  @Column({
    type: DataType.STRING,
  })
  countryCode: string;

  @Column({
    type: DataType.STRING,
  })
  countryName: string;

  @Column({
    type: DataType.STRING,
  })
  clearanceCode: string;
  @Column({
    type: DataType.STRING,
  })
  branchCode: string;
  @Column({
    type: DataType.STRING,
  })
  bankCode: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  frozenFor24Hours: boolean;
}

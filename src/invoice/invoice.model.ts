import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@app/user/models/user.model';
import { AppFile } from '@app/global/app-file/models/app-file.model';
import { InvoiceStatusEnum } from '@app/invoice/enums/invoice-status.enum';
import { Beneficiary } from '@app/beneficiary/models/beneficiary.model';
import { DataBoxDto } from '@app/invoice/dtos/invoice-crud-dtos/data-box.dto';
import { DataBox } from '@app/invoice/data-box.model';
import { BeneficiaryDto } from '@app/beneficiary/dtos/beneficiary.dto';

export interface InvoiceAttributes {
  id?: number;
  fileId: number;
  grossAmount: number;
  netAmount: number;
  taxNumber: string;
  dueDate: Date;
  issueDate: Date;
  beneficiaryId?: number;
  beneficiary?: BeneficiaryDto;
  submittedById: number;
  submittedBy?: User;
  assigneeId?: number;
  assignee?: User;
  reviewedById?: number;
  reviewedBy?: User;
  paidById?: number;
  paidBy?: User;
  approvedById?: number;
  approvedBy?: User;
  rejectedById?: number;
  rejectedBy?: User;
  dataBoxes?: DataBoxDto[];
  status: InvoiceStatusEnum;
}
export type InvoiceCreationAttributes = Optional<InvoiceAttributes, 'id'>;

@Table({
  defaultScope: {
    include: [
      {
        association: 'file',
      },
      {
        association: 'dataBoxes',
      },
    ],
  },
  scopes: {
    'all-users': {
      include: [
        {
          association: 'submittedBy',
          attributes: ['id', 'firstName', 'lastName', 'name', 'email'],
        },
        {
          association: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'name', 'email'],
        },
        {
          association: 'reviewedBy',
          attributes: ['id', 'firstName', 'lastName', 'name', 'email'],
        },
        {
          association: 'paidBy',
          attributes: ['id', 'firstName', 'lastName', 'name', 'email'],
        },

        {
          association: 'approvedBy',
          attributes: ['id', 'firstName', 'lastName', 'name', 'email'],
        },
        {
          association: 'rejectedBy',
          attributes: ['id', 'firstName', 'lastName', 'name', 'email'],
        },
      ],
    },
  },
})
export class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => AppFile)
  fileId: number;

  @BelongsTo(() => AppFile, { foreignKey: 'fileId', onDelete: 'CASCADE' })
  file: AppFile;

  @Column({
    type: DataType.DATE,
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
  })
  issueDate: Date;

  @Column({
    type: DataType.DOUBLE,
  })
  grossAmount: number;

  @Column({
    type: DataType.DOUBLE,
  })
  netAmount: number;

  @Column({
    type: DataType.STRING,
  })
  taxNumber: string;

  @BelongsTo(() => Beneficiary, 'beneficiaryId')
  beneficiary: Beneficiary;

  @ForeignKey(() => Beneficiary)
  beneficiaryId: number;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  submittedById: number;

  @BelongsTo(() => User, 'submittedById')
  submittedBy: User;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  assigneeId: number;

  @BelongsTo(() => User, 'assigneeId')
  assignee: User;

  @HasMany(() => DataBox, { foreignKey: 'invoiceId' })
  dataBoxes: DataBox[];

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  reviewedById: number;

  @BelongsTo(() => User, 'reviewedById')
  reviewedBy: User;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  paidById: number;

  @BelongsTo(() => User, 'paidById')
  paidBy: User;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  approvedById: number;

  @BelongsTo(() => User, 'approvedById')
  approvedBy: User;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  rejectedById: number;

  @BelongsTo(() => User, 'rejectedById')
  rejectedBy: User;

  @Column({
    type: DataType.ENUM(...Object.values(InvoiceStatusEnum)),
  })
  status: InvoiceStatusEnum;
}

import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@app/user/models/user.model';
import { AppFile } from '@app/global/app-file/models/app-file.model';

export interface InvoiceAttributes {
  id?: number;
  fileId: number;
  dueDate?: Date;
  issuedAt?: Date;
  amount?: number;
  submittedById: number;
  submittedBy?: User;
  assigneeId?: number;
  assignee?: User;
  reviewedById?: number;
  reviewedBy?: User;
  paidById?: number;
  paidBy?: User;
}
export type InvoiceCreationAttributes = Optional<InvoiceAttributes, 'id'>;

@Table
export class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => AppFile)
  fileId: number;
  @BelongsTo(() => AppFile, 'fileId')
  file: AppFile;

  @Column({
    type: DataType.DATE,
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
  })
  issuedAt: Date;

  @Column({
    type: DataType.DOUBLE,
  })
  amount: number;

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
}

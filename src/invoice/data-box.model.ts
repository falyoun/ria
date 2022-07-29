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
import { Invoice } from '@app/invoice/invoice.model';

export interface DataBoxAttributes {
  id?: number;
  invoiceId: number;
  invoice?: Invoice;
  key: string;
  value: string;
}
export type DataBoxCreationAttributes = Optional<DataBoxAttributes, 'id'>;

@Table
export class DataBox
  extends Model<DataBoxAttributes, DataBoxCreationAttributes>
  implements DataBoxAttributes
{
  @Column({
    type: DataType.STRING,
  })
  key: string;

  @Column({
    type: DataType.STRING,
  })
  value: string;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => Invoice)
  invoiceId: number;
  @BelongsTo(() => User, 'invoiceId')
  invoice: Invoice;
}

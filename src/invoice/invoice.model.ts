import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface InvoiceAttributes {
  id?: number;
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
}

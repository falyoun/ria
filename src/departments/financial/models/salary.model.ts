import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Receipt } from './receipt.model';

export interface SalaryAttributes {
  id: number;
  receiptId: number;
  workStartDate: Date;
  workEndDate: Date;
  amount: number;
  bonus?: number;
  allowance?: number;
}
export type SalaryCreationAttributes = Optional<SalaryAttributes, 'id'>;
@Table
export class Salary
  extends Model<SalaryAttributes, SalaryCreationAttributes>
  implements SalaryAttributes
{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  workStartDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  workEndDate: Date;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  })
  bonus: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  })
  allowance: number;

  @ForeignKey(() => Receipt)
  @Column({
    type: DataType.INTEGER,
  })
  receiptId: number;

  @BelongsTo(() => Receipt, 'receiptId')
  receipt: Receipt;
}

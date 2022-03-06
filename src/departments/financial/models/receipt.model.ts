import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Salary } from './salary.model';
import { Deduction } from './deduction.model';
import { User } from '@app/user/models/user.model';

export interface ReceiptAttributes {
  id: number;
  userId: number;
  salary?: Salary;
  deductions?: Deduction[];
}
export type ReceiptCreationAttributes = Optional<ReceiptAttributes, 'id'>;

@Table
export class Receipt
  extends Model<ReceiptAttributes, ReceiptCreationAttributes>
  implements ReceiptAttributes
{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasOne(() => Salary, { foreignKey: 'receiptId', onDelete: 'CASCADE' })
  salary: Salary;

  @HasMany(() => Deduction, { foreignKey: 'receiptId', onDelete: 'CASCADE' })
  deductions: Deduction[];
}

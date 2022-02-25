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
import { DeductionTypeEnum } from '@app/departments/financial/enums/deduction-type.enum';

export interface DeductionAttributes {
  id: number;
  receiptId: number;
  amount: number;
  type: DeductionTypeEnum;
  reason: string;
}
export type DeductionCreationAttributes = Optional<DeductionAttributes, 'id'>;
@Table
export class Deduction
  extends Model<DeductionAttributes, DeductionCreationAttributes>
  implements DeductionAttributes
{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => Receipt)
  @Column({
    type: DataType.INTEGER,
  })
  receiptId: number;

  @BelongsTo(() => Receipt, 'receiptId')
  receipt: Receipt;

  @Column({
    type: DataType.ENUM(...Object.values(DeductionTypeEnum)),
  })
  type: DeductionTypeEnum;

  @Column({
    type: DataType.DOUBLE,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
  })
  reason: string;
}

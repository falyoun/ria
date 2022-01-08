import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { DeductionTypeEnum } from '../enums';

export interface DeductionAttributes {
  id: number;
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

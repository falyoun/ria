import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface LeaveCategoryAttributes {
  id?: number;
  name: string;
  deductionAmount: number;
}
export type LeaveCategoryCreationAttributes = Optional<
  LeaveCategoryAttributes,
  'id'
>;

@Table
export class LeaveCategory
  extends Model<LeaveCategoryAttributes, LeaveCategoryCreationAttributes>
  implements LeaveCategoryAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.DOUBLE,
  })
  deductionAmount: number;
}

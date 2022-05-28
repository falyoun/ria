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
import { Department } from '@app/departments/models/department.model';

export interface DepartmentManagerAttributes {
  id?: number;
  departmentId: number;
  department?: Department;
  userId: number;
  user?: User;
}
export type DepartmentManagerCreationAttributes = Optional<
  DepartmentManagerAttributes,
  'id'
>;

@Table({
  indexes: [
    {
      name: 'department_manager_unique_constraint',
      fields: ['user_id', 'department_id'],
      unique: true,
    },
  ],
})
export class DepartmentManager
  extends Model<
    DepartmentManagerAttributes,
    DepartmentManagerCreationAttributes
  >
  implements DepartmentManagerAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => Department)
  departmentId: number;

  @BelongsTo(() => Department, 'departmentId')
  department: Department;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}

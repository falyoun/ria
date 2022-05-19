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

export interface DepartmentAttributes {
  id?: number;
  title: string;
  maxNumberOfEmployees?: number;
  users?: User[];
}
export type DepartmentCreationAttributes = Optional<DepartmentAttributes, 'id'>;

@Table({
  scopes: {
    'all-users': {
      include: [
        {
          association: 'users',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'name',
            'email',
            'phoneNumber',
          ],
        },
      ],
    },
  },
})
export class Department
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 10,
  })
  maxNumberOfEmployees: number;

  @HasMany(() => User, { foreignKey: 'departmentId' })
  users: User[];
}

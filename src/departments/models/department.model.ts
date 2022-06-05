import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '@app/user/models/user.model';
import { Job } from '@app/departments/financial/salary-scale/job/job.model';
import { DepartmentManager } from '@app/departments/models/department-manager.model';

export interface DepartmentAttributes {
  id?: number;
  title: string;
  maxNumberOfEmployees?: number;
  users?: User[];
  jobs?: Job[];
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
        {
          association: 'jobs',
        },
        {
          association: 'departmentManagers',
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
    unique: true,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 10,
  })
  maxNumberOfEmployees: number;

  @HasMany(() => User, { foreignKey: 'departmentId' })
  users: User[];

  @HasMany(() => Job, { foreignKey: 'departmentId' })
  jobs: Job[];

  @HasMany(() => DepartmentManager, { foreignKey: 'departmentId' })
  departmentManagers: DepartmentManager[];
}

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Department } from '@app/departments/models/department.model';

export interface JobAttributes {
  id?: number;
  name: string;
  departmentId?: number;
  department?: Department;
  description?: string;
}
export type JobCreationAttributes = Optional<JobAttributes, 'id'>;

@Table({
  scopes: {
    department: {
      include: [
        {
          association: 'department',
        },
      ],
    },
  },
})
export class Job
  extends Model<JobAttributes, JobCreationAttributes>
  implements JobAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => Department)
  departmentId: number;

  @BelongsTo(() => Department, 'departmentId')
  department: Department;
}

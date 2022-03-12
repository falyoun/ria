import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface JobAttributes {
  id?: number;
  name: string;
  description?: string;
}
export type JobCreationAttributes = Optional<JobAttributes, 'id'>;

@Table
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
}

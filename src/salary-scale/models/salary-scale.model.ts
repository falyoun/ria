import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { SalaryScaleJob } from '@app/salary-scale/models/salary-scale-job.model';

export interface SalaryScaleAttributes {
  id?: number;
  isActive: boolean;
  salaryScaleJobs?: SalaryScaleJob[];
}
export type SalaryScaleCreationAttributes = Optional<
  SalaryScaleAttributes,
  'id'
>;

@Table
export class SalaryScale
  extends Model<SalaryScaleAttributes, SalaryScaleCreationAttributes>
  implements SalaryScaleAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActive: boolean;

  @HasMany(() => SalaryScaleJob, 'salaryScaleId')
  salaryScaleJobs: SalaryScaleJob[];
}

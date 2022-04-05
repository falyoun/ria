import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Job } from '@app/departments/financial/salary-scale/job/job.model';
import { EmployeeLevelEnum } from '@app/departments/financial/salary-scale/enums/employee-level.enum';
import { SalaryScale } from '@app/departments/financial/salary-scale/models/salary-scale.model';

export interface SalaryScaleJobAttributes {
  id?: number;
  jobId: number;
  job?: Job;
  salaryScaleId: number;
  salaryScale: SalaryScale;
  employeeLevel: EmployeeLevelEnum;
  amount: number;
}
export type SalaryScaleJobCreationAttributes = Optional<
  SalaryScaleJobAttributes,
  'id'
>;

@Table({
  indexes: [
    {
      name: 'salary_scale_job_level_unique_constraint',
      fields: ['salary_scale_id', 'job_id', 'employee_level'],
      unique: true,
    },
  ],
})
export class SalaryScaleJob
  extends Model<SalaryScaleJobAttributes, SalaryScaleJobCreationAttributes>
  implements SalaryScaleJobAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => Job)
  jobId: number;
  @BelongsTo(() => Job, 'jobId')
  job: Job;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => SalaryScale)
  salaryScaleId: number;
  @BelongsTo(() => SalaryScale, {
    foreignKey: 'salaryScaleId',
    onDelete: 'CASCADE',
  })
  salaryScale: SalaryScale;

  @Column({
    type: DataType.ENUM(...Object.values(EmployeeLevelEnum)),
    allowNull: false,
  })
  employeeLevel: EmployeeLevelEnum;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  amount: number;
}

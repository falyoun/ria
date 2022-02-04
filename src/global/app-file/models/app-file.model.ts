import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface AppFileAttributes {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  url: string;
}
export type AppFileCreationAttributes = Optional<AppFileAttributes, 'id'>;
@Table
export class AppFile
  extends Model<AppFileAttributes, AppFileCreationAttributes>
  implements AppFileAttributes
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
  filename: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mimetype: string;
}

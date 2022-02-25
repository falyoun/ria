import {
  BelongsTo,
  Column,
  Table,
  NotEmpty,
  NotNull,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { DataTypes, Optional } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { Role } from './role.model';
import { ActionTypes, possessionTypes } from '@app/role/enums/grant-action.eum';

export interface GrantAttributes {
  id: number;
  resource: string;
  action: ActionTypes;
  possession: possessionTypes;
  roleId: number;
}
export type GrantCreationAttributes = Optional<GrantAttributes, 'id'>;

@Table({
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['resource', 'action', 'possession', 'role_id'],
    },
  ],
})
export class Grant
  extends Model<GrantAttributes, GrantCreationAttributes>
  implements GrantAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @NotEmpty
  @NotNull
  @Column({
    allowNull: false,
  })
  resource: string;

  @NotEmpty
  @NotNull
  @Column({
    type: DataTypes.ENUM(...Object.values(ActionTypes)),
    allowNull: false,
  })
  action: ActionTypes;

  @NotEmpty
  @NotNull
  @Column({
    type: DataTypes.ENUM(...Object.values(possessionTypes)),
    allowNull: false,
  })
  possession: possessionTypes;

  @Column
  @ForeignKey(() => Role)
  roleId: number;

  @BelongsTo(() => Role, 'roleId')
  role: Role;
}

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
import {
  ActionTypesEnum,
  PossessionTypesEnum,
} from '@app/role/enums/grant-action.eum';
import { UserRole } from '@app/role/models/user-role.model';

export interface GrantAttributes {
  id: number;
  resource: string;
  action: ActionTypesEnum;
  possession: PossessionTypesEnum;
  userRoleId: number;
}
export type GrantCreationAttributes = Optional<GrantAttributes, 'id'>;

@Table({
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['resource', 'action', 'possession', 'user_role_id'],
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
    type: DataTypes.ENUM(...Object.values(ActionTypesEnum)),
    allowNull: false,
  })
  action: ActionTypesEnum;

  @NotEmpty
  @NotNull
  @Column({
    type: DataTypes.ENUM(...Object.values(PossessionTypesEnum)),
    allowNull: false,
  })
  possession: PossessionTypesEnum;

  @Column
  @ForeignKey(() => UserRole)
  userRoleId: number;

  @BelongsTo(() => UserRole, 'userRoleId')
  userRole: UserRole;
}

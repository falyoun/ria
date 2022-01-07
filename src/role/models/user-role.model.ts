import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Optional } from 'sequelize';
import { UserModel } from '@app/user';

export interface UserRoleAttributes {
  id: number;
  roleId: number;
  role?: Role;
  userId: number;
  user?: UserModel;
}
export type UserRoleCreationAttributes = Optional<UserRoleAttributes, 'id'>;

export const UserRoleModelAliases = {
  ROLE: 'role',
};

@Table({
  defaultScope: {
    include: [
      {
        association: UserRoleModelAliases.ROLE,
      },
    ],
  },
  timestamps: false,
  paranoid: false,
})
export class UserRole
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @BelongsTo(() => UserModel, 'userId')
  user: UserModel;

  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => Role, 'roleId')
  role: Role;

  @Column({
    type: DataType.INTEGER,
  })
  roleId: number;
}

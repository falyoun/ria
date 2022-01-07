import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import { AppRole } from '../enums';
import { UserRole } from './user-role.model';
import { Grant } from './grant.model';
export interface RoleAttributes {
  id: number;
  name: AppRole;
  userRoles?: UserRole[];
  grants?: Grant[];
}
export type RoleCreationAttributes = Optional<RoleAttributes, 'id'>;

@Table({
  timestamps: false,
  paranoid: false,
})
export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.ENUM(...Object.values(AppRole)),
    unique: true,
  })
  name: AppRole;

  @HasMany(() => UserRole, 'roleId')
  userRoles: UserRole[];

  @HasMany(() => Grant, 'roleId')
  grants: Grant[];
}

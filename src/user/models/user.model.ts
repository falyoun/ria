import {
  AutoIncrement,
  BeforeSave,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import { AppRole, UserRole } from '@app/role';
import { Receipt } from '@app/departments';
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string;
  isActive?: boolean;
  isVerified?: boolean;
  roles?: AppRole[];
  associatedRoles?: UserRole[];
  receipts?: Receipt[];
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export const UserModelScopes = {
  JOIN_USER_ROLE_TABLES: 'join_user_role_tables',
};
export const UserModelAliases = {
  USER_ROLE: 'associatedRoles',
};

@Table({
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
  },
  scopes: {
    [UserModelScopes.JOIN_USER_ROLE_TABLES]: {
      include: [
        {
          model: UserRole,
          as: UserModelAliases.USER_ROLE,
        },
      ],
    },
  },
})
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Unique
  @Column({
    type: DataType.CITEXT,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
  })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
  })
  lastName: string;

  @Column({
    type: DataType.VIRTUAL(DataType.STRING),
    get(this: User) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  name: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  phoneNumber: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  isActive: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  isVerified: boolean;

  @Column({
    type: DataType.VIRTUAL(DataType.ARRAY),
    get(this: User) {
      return Array.isArray(this.associatedRoles)
        ? this.associatedRoles.map((r) => r.role.name)
        : [];
    },
  })
  roles: AppRole[];

  @HasMany(() => UserRole, {
    foreignKey: 'userId',
    as: UserModelAliases.USER_ROLE,
  })
  associatedRoles: UserRole[];

  @HasMany(() => Receipt, {
    foreignKey: 'userId',
  })
  receipts: Receipt[];

  @BeforeSave({})
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      const hashedP = await bcrypt.hash(user.password, 10);
      user.set('password', hashedP);
    }
  }

  isPasswordValid(passwordToCheck: string): Promise<boolean> {
    return bcrypt.compare(passwordToCheck, this['password']);
  }

  toJSON<T extends UserAttributes>(): T {
    const obj: T = super.toJSON();
    obj['password'] = undefined;
    return obj;
  }
}

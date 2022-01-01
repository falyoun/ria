import {
  AutoIncrement,
  BeforeSave,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import bcrypt from 'bcrypt';
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
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;
@Table
export class UserModel
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
    get(this: UserModel) {
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

  @BeforeSave({})
  static async hashPassword(user: UserModel) {
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

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
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import { AppFile } from '@app/global/app-file/models/app-file.model';
import { AppRole } from '@app/role/enums/app-role.enum';
import { UserRole } from '@app/role/models/user-role.model';
import { Receipt } from '@app/departments/financial/models/receipt.model';
import { EmployeeLevelEnum } from '@app/departments/financial/salary-scale/enums/employee-level.enum';
import { Job } from '@app/departments/financial/salary-scale/job/job.model';
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  avatar?: AppFile;
  avatarId?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string;
  isActive?: boolean;
  isVerified?: boolean;
  jobId?: number;
  job?: Job;
  level?: EmployeeLevelEnum;
  roles?: AppRole[];
  associatedRoles?: UserRole[];
  receipts?: Receipt[];
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

@Table({
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
    include: [
      {
        association: 'associatedRoles',
      },
      {
        association: 'avatar',
      },
      {
        association: 'job',
      },
    ],
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
    allowNull: true,
    type: DataType.INTEGER,
  })
  @ForeignKey(() => AppFile)
  avatarId: number;
  @BelongsTo(() => AppFile, {
    foreignKey: 'avatarId',
    as: 'avatar',
  })
  avatar: AppFile;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => Job)
  jobId: number;

  @BelongsTo(() => Job, 'jobId')
  job: Job;

  @Column({
    type: DataType.ENUM(...Object.values(EmployeeLevelEnum)),
  })
  level: EmployeeLevelEnum;

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

  @HasMany(() => UserRole, 'userId')
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

import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@app/user/models/user.model';
import { LeaveCategory } from '@app/leave/models/leave-category.model';

export interface UserLeaveCategoryAttributes {
  id?: number;
  leaveCategoryId: number;
  leaveCategory?: LeaveCategory;
  userId: number;
  user?: User;
  numberOfDaysAllowed: number;
}
export type UserLeaveCategoryCreationAttributes = Optional<
  UserLeaveCategoryAttributes,
  'id'
>;

@Table({
  indexes: [
    {
      name: 'user_leave_category_unique_constraint',
      fields: ['user_id', 'leave_category_id'],
      unique: true,
    },
  ],
})
export class UserLeaveCategory
  extends Model<
    UserLeaveCategoryAttributes,
    UserLeaveCategoryCreationAttributes
  >
  implements UserLeaveCategoryAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => LeaveCategory)
  leaveCategoryId: number;

  @BelongsTo(() => LeaveCategory, 'leaveCategoryId')
  leaveCategory: LeaveCategory;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  })
  numberOfDaysAllowed: number;
}

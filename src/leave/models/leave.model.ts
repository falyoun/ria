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
import { LeaveStatusEnum } from '@app/leave/enums/leave-status.enum';
import { LeaveCategoryEnum } from '@app/leave/enums/leave-category.enum';

export interface LeaveAttributes {
  id?: number;

  description: string;

  fromDate: Date;
  toDate: Date;

  managerId?: number;
  manager?: User;

  requesterId?: number;
  requester?: User;

  category: LeaveCategoryEnum;
  status: LeaveStatusEnum;
}
export type LeaveCreationAttributes = Optional<LeaveAttributes, 'id'>;

@Table({
  scopes: {
    'all-users': {
      include: [
        {
          association: 'manager',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'name',
            'email',
            'phoneNumber',
          ],
        },
        {
          association: 'requester',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'name',
            'email',
            'phoneNumber',
          ],
        },
      ],
    },
  },
})
export class Leave
  extends Model<LeaveAttributes, LeaveCreationAttributes>
  implements LeaveAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.DATE,
  })
  fromDate: Date;
  @Column({
    type: DataType.DATE,
  })
  toDate: Date;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  managerId: number;

  @BelongsTo(() => User, 'paidById')
  manager: User;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  requesterId: number;

  @BelongsTo(() => User, 'requesterId')
  requester: User;

  @Column({
    type: DataType.ENUM(...Object.values(LeaveStatusEnum)),
  })
  status: LeaveStatusEnum;

  @Column({
    type: DataType.ENUM(...Object.values(LeaveCategoryEnum)),
  })
  category: LeaveCategoryEnum;
}

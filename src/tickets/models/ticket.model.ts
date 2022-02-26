import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import { TicketTypeEnum } from '@app/tickets/enums/ticket-type.enum';
import { User } from '@app/user/models/user.model';
import { TicketStatusEnum } from '@app/tickets/enums/ticket-status.enum';
export interface TicketAttributes {
  id: number;
  type: TicketTypeEnum;
  userId: number;
  user?: User;
  status: TicketStatusEnum;
  note?: string;
}
export type TicketCreationAttributes = Optional<TicketAttributes, 'id'>;

@Table({
  defaultScope: {
    include: [
      {
        association: 'user',
        attributes: ['first_name', 'last_name', 'email'],
        include: [
          {
            association: 'associatedRoles',
            attributes: [],
          },
          {
            association: 'avatar',
            attributes: ['url'],
          },
        ],
      },
    ],
  },
})
export class Ticket
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.ENUM(...Object.values(TicketTypeEnum)),
  })
  type: TicketTypeEnum;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column({
    type: DataType.ENUM(...Object.values(TicketStatusEnum)),
    defaultValue: TicketStatusEnum.OPEN,
  })
  status: TicketStatusEnum;

  @Column({
    type: DataType.TEXT,
  })
  note: string;
}

import { TicketTypeEnum } from '@app/tickets/enums/ticket-type.enum';
import { TicketStatusEnum } from '@app/tickets/enums/ticket-status.enum';
import { Allow, IsEnum, IsPositive, IsString } from 'class-validator';
import { UserDto } from '@app/user/dtos/user.dto';

export class TicketDto {
  @IsPositive()
  id: number;
  @IsEnum(TicketTypeEnum)
  type: TicketTypeEnum;
  @IsPositive()
  userId: number;
  @Allow()
  user: UserDto;
  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;
  @IsString()
  note: string;
}

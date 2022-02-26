import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketTypeEnum } from '@app/tickets/enums/ticket-type.enum';
import { TicketStatusEnum } from '@app/tickets/enums/ticket-status.enum';

export class CreateTicketDto {
  @IsEnum(TicketTypeEnum)
  type: TicketTypeEnum;
  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;
  @IsString()
  @IsOptional()
  note?: string;
}

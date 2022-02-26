import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from '@app/tickets/dtos/create-ticket.dto';
import { IsEnum } from 'class-validator';
import { TicketStatusEnum } from '@app/tickets/enums/ticket-status.enum';

export class UpdateTicketDto extends PartialType(
  OmitType(CreateTicketDto, ['type']),
) {
  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;
}

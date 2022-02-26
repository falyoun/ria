import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from '@app/tickets/dtos/create-ticket.dto';

export class UpdateTicketDto extends PartialType(
  OmitType(CreateTicketDto, ['type']),
) {}

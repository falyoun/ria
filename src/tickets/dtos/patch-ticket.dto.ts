import { PickType } from '@nestjs/swagger';
import { UpdateTicketDto } from '@app/tickets/dtos/update-ticket.dto';

export class PatchTicketDto extends PickType(UpdateTicketDto, ['status']) {}

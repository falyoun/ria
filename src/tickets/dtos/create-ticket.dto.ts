import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketTypeEnum } from '@app/tickets/enums/ticket-type.enum';

export class CreateTicketDto {
  @IsEnum(TicketTypeEnum)
  type: TicketTypeEnum;

  @IsString()
  @IsOptional()
  note?: string;
}

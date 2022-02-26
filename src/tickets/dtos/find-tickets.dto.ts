import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';
import { TicketStatusEnum } from '@app/tickets/enums/ticket-status.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class FindTicketsDto extends SequelizePaginationDto {
  @IsEnum(TicketStatusEnum)
  @IsOptional()
  status?: TicketStatusEnum;
}

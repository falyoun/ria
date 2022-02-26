import { Module } from '@nestjs/common';
import { TicketsController } from '@app/tickets/controllers/tickets.controller';
import { TicketsService } from '@app/tickets/services/tickets.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ticket } from '@app/tickets/models/ticket.model';

@Module({
  imports: [SequelizeModule.forFeature([Ticket])],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}

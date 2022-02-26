import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleGuard } from '@app/role/guards/role.guard';
import { AppRole } from '@app/role/enums/app-role.enum';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { TicketDto } from '@app/tickets/dtos/ticket.dto';
import { UserDto } from '@app/user/dtos/user.dto';
import { RequestUser } from '@app/spa-authentication';
import { User } from '@app/user/models/user.model';
import { CreateTicketDto } from '@app/tickets/dtos/create-ticket.dto';
import { TicketsService } from '@app/tickets/services/tickets.service';
import { ApiPaginatedDto, ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { UpdateTicketDto } from '@app/tickets/dtos/update-ticket.dto';
import { PatchTicketDto } from '@app/tickets/dtos/patch-ticket.dto';
import { FindTicketsDto } from '@app/tickets/dtos/find-tickets.dto';
import { MessageResponseDto } from '@app/shared/dtos/message-response.dto';
import { use } from 'passport';

@ApiTags('Tickets')
@UseGuards(
  RoleGuard(
    AppRole.SUPER_ADMIN,
    AppRole.ADMIN,
    AppRole.HR_MANAGER,
    AppRole.MANAGER,
    AppRole.USER,
  ),
)
@Controller('tickets')
@ApiExtraModels(TicketDto, UserDto)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  @ApiRiaDto(TicketDto)
  @Post()
  createTicket(
    @RequestUser() user: User,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.ticketsService.createTicket(user, createTicketDto);
  }

  @ApiRiaDto(TicketDto)
  @Patch(':id')
  patchTicket(
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() patchTicketDto: PatchTicketDto,
  ) {
    return this.ticketsService.patchTicket(id, user, patchTicketDto);
  }
  @ApiRiaDto(TicketDto)
  @Put(':id')
  updateTicket(
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTicketDto,
  ) {
    return this.ticketsService.updateTicket(
      {
        where: {
          id,
          userId: user.id,
        },
      },
      body,
    );
  }

  @ApiPaginatedDto(TicketDto)
  @Get('by-admin')
  findSystemTickets(
    @RequestUser() user: User,
    @Query() findTicketsDto: FindTicketsDto,
  ) {
    return this.ticketsService.findSystemTickets(user, findTicketsDto);
  }

  @ApiPaginatedDto(TicketDto)
  @Get()
  findTickets(
    @RequestUser() user: User,
    @Query() findTicketsDto: FindTicketsDto,
  ) {
    return this.ticketsService.findAllTickets(user, findTicketsDto);
  }
  @ApiRiaDto(TicketDto)
  @Get(':id')
  getTicket(@RequestUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findTicket({
      where: {
        id,
      },
    });
  }

  @ApiRiaDto(MessageResponseDto)
  @Delete(':id/by-admin')
  deleteOneByAdmin(
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ticketsService.deleteOneByAdmin(user, {
      where: {
        id,
      },
    });
  }
  @ApiRiaDto(MessageResponseDto)
  @Delete(':id')
  deleteOne(@RequestUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.deleteOne({
      where: {
        id,
        userId: user.id,
      },
    });
  }
}

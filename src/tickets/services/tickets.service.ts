import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from '@app/tickets/models/ticket.model';
import { User } from '@app/user/models/user.model';
import { CreateTicketDto } from '@app/tickets/dtos/create-ticket.dto';
import { UpdateTicketDto } from '@app/tickets/dtos/update-ticket.dto';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import {
  ActionOnTicketException,
  TicketNotFound,
} from '@app/tickets/exceptions';
import { FindTicketsDto } from '@app/tickets/dtos/find-tickets.dto';
import { RiaUtils } from '@app/shared/utils';
import {
  isUserInCoreTeam,
  isUserInManagementTeam,
} from '@app/role/utils/role-checker';
import { PatchTicketDto } from '@app/tickets/dtos/patch-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket) private readonly ticketModel: typeof Ticket,
  ) {}
  async findTicket(findOptions: FindOptions<Ticket>) {
    const ticket = await this.ticketModel.findOne(findOptions);
    if (!ticket) {
      throw new TicketNotFound();
    }
    return ticket;
  }
  createTicket(user: User, createTicketDto: CreateTicketDto) {
    return this.ticketModel.create({
      ...createTicketDto,
      userId: user.id,
    });
  }
  async updateTicket(
    findOptions: FindOptions<Ticket>,
    updateTicketDto: UpdateTicketDto,
  ) {
    const ticket = await this.findTicket(findOptions);
    return ticket.update({
      ...updateTicketDto,
    });
  }

  async patchTicket(
    ticketId: number,
    doer: User,
    patchTicketDto: PatchTicketDto,
  ) {
    if (!isUserInCoreTeam(doer) && !isUserInManagementTeam(doer)) {
      throw new ActionOnTicketException('PATCH');
    }
    const ticket = await this.findTicket({
      where: {
        id: ticketId,
      },
    });

    return ticket.update({
      status: patchTicketDto.status,
    });
  }

  async findAllTickets(user: User, findTicketsDto: FindTicketsDto) {
    let whereOptions: WhereOptions<Ticket> = {
      userId: user.id,
    };
    if (findTicketsDto.status) {
      whereOptions = {
        ...whereOptions,
        status: {
          [Op.like]: `%${findTicketsDto.status}%`,
        },
      };
    }
    const findOptions: FindOptions<Ticket> = {
      where: whereOptions,
    };
    RiaUtils.applyPagination<Ticket>(findOptions, findTicketsDto);
    return this.ticketModel.findAll(findOptions);
  }
  async findSystemTickets(user: User, findTicketsDto: FindTicketsDto) {
    if (!isUserInCoreTeam(user) || !isUserInManagementTeam(user)) {
      throw new ActionOnTicketException('GET');
    }
    let whereOptions: WhereOptions<Ticket> = {};
    if (findTicketsDto.status) {
      whereOptions = {
        ...whereOptions,
        status: {
          [Op.like]: `%${findTicketsDto.status}%`,
        },
      };
    }
    const findOptions: FindOptions<Ticket> = {
      where: whereOptions,
    };
    RiaUtils.applyPagination<Ticket>(findOptions, findTicketsDto);
    return this.ticketModel.findAll(findOptions);
  }
}

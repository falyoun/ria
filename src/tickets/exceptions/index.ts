import {
  ResourceNotAccessibleException,
  ResourceNotFoundException,
} from '@app/shared/exceptions/coded-exception';

export class TicketNotFound extends ResourceNotFoundException {
  constructor() {
    super('TICKET');
  }
}

export class ActionOnTicketException extends ResourceNotAccessibleException {
  constructor(accessType?: string) {
    super('TICKET', accessType);
  }
}

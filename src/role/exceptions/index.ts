import { HttpStatus } from '@nestjs/common';
import { CodedException } from '@app/shared';

export class RolesNotLoadedCorrectlyException extends CodedException {
  constructor() {
    super(
      'ROLE_NOT_IN_MEMORY',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Required role is not accessible via in-memory',
    );
  }
}

export class RoleNotFoundException extends CodedException {
  constructor() {
    super(
      'ROLE_NOT_FOUND',
      HttpStatus.BAD_REQUEST,
      'Required role does not exist in the system',
    );
  }
}

export class UserOwnsTheRoleException extends CodedException {
  constructor() {
    super(
      'USER_ALREADY_OWN_THE_ROLE',
      HttpStatus.BAD_REQUEST,
      'Required role is already assigned to user',
    );
  }
}

export class UserDoesNotOwnTheRoleException extends CodedException {
  constructor() {
    super(
      'USER_ALREADY_OWN_THE_ROLE',
      HttpStatus.BAD_REQUEST,
      'Required role is not assigned to user',
    );
  }
}

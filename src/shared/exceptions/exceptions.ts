import { HttpStatus } from '@nestjs/common';
import { CodedException, ResourceNotFoundException } from './coded-exception';

export class NotEnoughDataException extends CodedException {
  constructor() {
    super(
      'NOT_SUFFICIENT_DATA',
      HttpStatus.BAD_REQUEST,
      'No enough data provided',
    );
  }
}

export class BadLoginCredentialsException extends CodedException {
  constructor() {
    super('401', HttpStatus.BAD_REQUEST, 'Incorrect Email or Password');
  }
}

export class AccountAlreadyActivatedException extends CodedException {
  constructor() {
    super('600', HttpStatus.BAD_REQUEST, 'Account is already activated');
  }
}

export class PasswordResetNotRequestedException extends CodedException {
  constructor() {
    super(
      'AUTH_PWD_RESET_NOT_REQUESTED',
      HttpStatus.BAD_REQUEST,
      'Password reset has not been requested',
    );
  }
}

export class InCorrectActivationTokenException extends CodedException {
  constructor() {
    super(
      'AUTH_INCORRECT_ACTIVATION_TOKEN',
      HttpStatus.BAD_REQUEST,
      'Token supplied does not match the token stored',
    );
  }
}

export class AccountNotFoundException extends ResourceNotFoundException {
  constructor() {
    super('USER');
  }
}

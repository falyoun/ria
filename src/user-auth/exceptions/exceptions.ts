import { HttpStatus } from '@nestjs/common';
import { CodedException } from '@app/shared/exceptions/coded-exception';

export class InvalidToken extends CodedException {
  constructor() {
    super('Invalid token', HttpStatus.UNAUTHORIZED, 'Invalid token');
  }
}

export class VerifiedUserException extends CodedException {
  constructor() {
    super('VERIFIED_USER', HttpStatus.BAD_REQUEST, 'Verified user');
  }
}

export class InvalidRegisterTokenException extends CodedException {
  constructor() {
    super(
      'INVALID_REGISTER_TOKEN',
      HttpStatus.BAD_REQUEST,
      'Invalid register token',
    );
  }
}

export class UnverifiedUserException extends CodedException {
  constructor() {
    super('UNVERIFIED_USER', HttpStatus.BAD_REQUEST, 'Unverified user');
  }
}

export class RegistrationTokenExpiredException extends CodedException {
  constructor() {
    super(
      'REGISTRATION_TOKEN_EXPIRED',
      HttpStatus.BAD_REQUEST,
      'Ur respiration token had expired',
    );
  }
}

export class SamePasswordException extends CodedException {
  constructor() {
    super('SAME_PASSWORD', HttpStatus.BAD_REQUEST, 'same password');
  }
}

export class InactiveUserException extends CodedException {
  constructor() {
    super('INACTIVE_USER', HttpStatus.BAD_REQUEST, 'inactive user');
  }
}

export class MalformedJwtPayload extends CodedException {
  constructor() {
    super(
      'MALFORMED_JWT',
      HttpStatus.BAD_REQUEST,
      'extracted jwt payload is not valid',
    );
  }
}

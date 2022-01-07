import { HttpStatus } from '@nestjs/common';
import { UserAuthExceptionCode } from './exception-code.enum';
import { CodedException } from '@app/shared';

export class InvalidToken extends CodedException {
  constructor() {
    super('Invalid token', HttpStatus.UNAUTHORIZED, 'Invalid token');
  }
}

export class VerificationEmailHasBeenSentException extends CodedException {
  constructor() {
    super(
      UserAuthExceptionCode.VERIFICATION_EMAIL_HAS_BEEN_SENT,
      HttpStatus.BAD_REQUEST,
      'Verification email has been sent',
    );
  }
}

export class VerifiedUserException extends CodedException {
  constructor() {
    super(
      UserAuthExceptionCode.VERIFIED_USER,
      HttpStatus.BAD_REQUEST,
      'Verified user',
    );
  }
}

export class InvalidRegisterTokenException extends CodedException {
  constructor() {
    super(
      UserAuthExceptionCode.INVALID_REGISTER_TOKEN,
      HttpStatus.BAD_REQUEST,
      'Invalid register token',
    );
  }
}

export class UnverifiedUserException extends CodedException {
  constructor() {
    super(
      UserAuthExceptionCode.UNVERIFIED_USER,
      HttpStatus.BAD_REQUEST,
      'Unverified user',
    );
  }
}

export class AlreadyInvitedException extends CodedException {
  constructor() {
    super(
      UserAuthExceptionCode.ALREADY_INVITED,
      HttpStatus.BAD_REQUEST,
      'You have already invited',
    );
  }
}

export class RegistrationTokenExpiredException extends CodedException {
  constructor() {
    super(
      UserAuthExceptionCode.REGISTRATION_TOKEN_EXPIRED,
      HttpStatus.BAD_REQUEST,
      'Ur respiration token had expired',
    );
  }
}

export class SamePasswordException extends CodedException {
  constructor() {
    super(
      UserAuthExceptionCode.SAME_PASSWORD,
      HttpStatus.BAD_REQUEST,
      'same password',
    );
  }
}

export class InactiveUserException extends CodedException {
  constructor() {
    super(
      UserAuthExceptionCode.INACTIVE_USER,
      HttpStatus.BAD_REQUEST,
      'inactive user',
    );
  }
}

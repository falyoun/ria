import { HttpStatus } from '@nestjs/common';
import { CodedException } from '@app/shared/exceptions/coded-exception';

export class AlreadyExistsException extends CodedException {
  constructor() {
    super(
      'ALREADY_EXISTS',
      HttpStatus.BAD_REQUEST,
      'BENEFICIARY.ALREADY_EXISTS',
    );
  }
}

export class BeneficiaryNotFoundException extends CodedException {
  constructor() {
    super(
      'BENEFICIARY_NOT_FOUND',
      HttpStatus.BAD_REQUEST,
      'BENEFICIARY.NOT_FOUND',
    );
  }
}
export class BeneficiaryInCoolDownException extends CodedException {
  constructor() {
    super(
      'BENEFICIARY_COOL_DOWN',
      HttpStatus.BAD_REQUEST,
      'BENEFICIARY.BENEFICIARY_COOL_DOWN',
    );
  }
}

export class InActiveBeneficiaryException extends CodedException {
  constructor() {
    super(
      'BENEFICIARY_COOL_DOWN',
      HttpStatus.BAD_REQUEST,
      'BENEFICIARY.IN_ACTIVE',
    );
  }
}

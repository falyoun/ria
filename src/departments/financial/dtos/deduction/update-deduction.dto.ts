import { PartialType, PickType } from '@nestjs/swagger';
import { CreateDeductionDto } from './create-deduction.dto';

export class UpdateDeductionDto extends PartialType(PickType(CreateDeductionDto, [
  'type',
  'amount',
  'reason',
] as const)) {}

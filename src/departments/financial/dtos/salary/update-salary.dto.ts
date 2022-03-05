import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSalaryDto } from './create-salary.dto';

export class UpdateSalaryDto extends OmitType<CreateSalaryDto, 'receiptId'>(
  CreateSalaryDto,
  ['receiptId'] as const,
) {}

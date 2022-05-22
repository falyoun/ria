import { PickType } from '@nestjs/swagger';
import { LeaveDto } from '@app/leave/dtos/leave.dto';

export class CreateLeaveDto extends PickType(LeaveDto, [
  'description',
  'fromDate',
  'toDate',
  'category',
] as const) {}

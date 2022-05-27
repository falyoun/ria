import { PickType } from '@nestjs/swagger';
import { LeaveDto } from '@app/leave/dtos/leave.dto';
import { IsPositive } from 'class-validator';

export class CreateLeaveDto extends PickType(LeaveDto, [
  'description',
  'fromDate',
  'toDate',
] as const) {
  @IsPositive()
  leaveCategoryId: number;
}

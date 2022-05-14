import { LeaveStatusEnum } from '@app/leave/enums/leave-status.enum';
import { Allow, IsDate, IsEnum, IsPositive, IsString } from 'class-validator';
import { UserDto } from '@app/user/dtos/user.dto';
import { LeaveCategoryEnum } from '@app/leave/enums/leave-category.enum';

export class LeaveDto {
  @IsPositive()
  id?: number;

  @IsString()
  description?: string;

  @IsDate()
  fromDate: Date;
  @IsDate()
  toDate: Date;

  @IsPositive()
  managerId?: number;
  @Allow()
  manager?: UserDto;

  @IsPositive()
  requesterId?: number;
  @Allow()
  requester?: UserDto;

  @IsEnum(LeaveStatusEnum)
  status: LeaveStatusEnum;

  @IsEnum(LeaveCategoryEnum)
  category: LeaveCategoryEnum;
}

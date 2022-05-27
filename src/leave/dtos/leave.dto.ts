import { LeaveStatusEnum } from '@app/leave/enums/leave-status.enum';
import {
  Allow,
  IsDate,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserDto } from '@app/user/dtos/user.dto';
import { Transform } from 'class-transformer';

export class LeaveDto {
  @IsPositive()
  id?: number;

  @IsString()
  description?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  fromDate: Date;

  @Transform(({ value }) => new Date(value))
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

  @IsString()
  categoryName: string;

  @IsNumber()
  deductionAmount: number;
}

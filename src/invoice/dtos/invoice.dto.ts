import {
  Allow,
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserDto } from '@app/user/dtos/user.dto';
import { Transform } from 'class-transformer';

export class InvoiceDto {
  @Allow()
  id?: number;
  @Allow()
  fileId?: number;

  @IsPositive()
  grossAmount: number;
  @IsPositive()
  netAmount: number;
  @IsString()
  @IsNotEmpty()
  taxNumber: string;
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dueDate: Date;
  @Transform(({ value }) => new Date(value))
  @IsDate()
  issueDate: Date;

  @Allow()
  submittedById: number;
  @Allow()
  submittedBy?: UserDto;
  @Allow()
  assigneeId?: number;
  @Allow()
  assignee?: UserDto;
  @Allow()
  reviewedById?: number;
  @Allow()
  reviewedBy?: UserDto;
  @Allow()
  paidById?: number;
  @Allow()
  paidBy?: UserDto;
}

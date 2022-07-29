import {
  Allow,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserDto } from '@app/user/dtos/user.dto';
import { Transform } from 'class-transformer';
import { InvoiceStatusEnum } from '@app/invoice/enums/invoice-status.enum';
import { DataBoxDto } from '@app/invoice/dtos/invoice-crud-dtos/data-box.dto';

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

  @IsEnum(InvoiceStatusEnum)
  status: InvoiceStatusEnum;

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

  @Allow()
  dataBoxes: DataBoxDto[];
}

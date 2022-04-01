import { Allow } from 'class-validator';
import { UserDto } from '@app/user/dtos/user.dto';

export class InvoiceDto {
  @Allow()
  id?: number;
  @Allow()
  fileId?: number;
  @Allow()
  dueDate?: Date;
  @Allow()
  issuedAt?: Date;
  @Allow()
  amount?: number;
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

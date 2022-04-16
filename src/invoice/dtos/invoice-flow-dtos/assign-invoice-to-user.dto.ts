import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class AssignInvoiceToUserDto {
  @IsPositive()
  userId: number;

  @IsString()
  @IsNotEmpty()
  assignmentNote: string;
}

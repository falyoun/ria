import { IsPositive } from 'class-validator';

export class CreateReceiptDto {
  @IsPositive()
  userId: number;
}

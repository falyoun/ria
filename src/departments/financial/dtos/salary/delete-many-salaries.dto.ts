import { IsArray, MinLength } from 'class-validator';

export class DeleteManySalariesDto {
  @IsArray()
  @MinLength(1)
  ids: number[];
}

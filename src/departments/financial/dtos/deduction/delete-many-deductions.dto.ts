import { IsArray, MinLength } from 'class-validator';

export class DeleteManyDeductionsDto {
  @IsArray()
  @MinLength(1)
  ids: number[];
}

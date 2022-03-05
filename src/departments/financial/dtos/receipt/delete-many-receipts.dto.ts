import { IsArray, MinLength } from 'class-validator';

export class DeleteManyReceiptsDto {
  @IsArray()
  @MinLength(1)
  ids: number[];
}

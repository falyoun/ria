import { ArrayMinSize, IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddUsersToDepartmentDto {
  @IsArray()
  @ArrayMinSize(1)
  ids: number[];

  @Transform(({ value }) => !!value)
  @IsBoolean()
  @IsOptional()
  overwrite?: boolean;
}

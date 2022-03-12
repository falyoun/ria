import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class JobDto {
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

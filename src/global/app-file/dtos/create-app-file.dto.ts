import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppFileDto {
  @IsString()
  @IsNotEmpty()
  filename: string;
  @IsString()
  @IsNotEmpty()
  path: string;
  @IsString()
  @IsNotEmpty()
  mimetype: string;
  @IsString()
  @IsNotEmpty()
  url: string;
}

import { IsString } from 'class-validator';

export class AppFileDto {
  @IsString()
  filename: string;
  @IsString()
  path: string;
  @IsString()
  mimetype: string;
  @IsString()
  url: string;
}

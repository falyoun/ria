import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

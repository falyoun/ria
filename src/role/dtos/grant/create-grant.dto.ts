import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionTypes, possessionTypes } from '@app/role/enums/grant-action.eum';

export class CreateGrantDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString({ always: true })
  resource: string;

  @ApiProperty({ enum: ActionTypes })
  @IsNotEmpty()
  @IsString({ always: true })
  action: ActionTypes;

  @ApiProperty({ enum: possessionTypes })
  @IsNotEmpty()
  @IsString({ always: true })
  possession: possessionTypes;

  @IsPositive()
  roleId: number;
}

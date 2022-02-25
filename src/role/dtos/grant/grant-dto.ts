import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ActionTypes, possessionTypes } from '@app/role/enums/grant-action.eum';

export class GrantDto {
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
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import {
  ActionTypesEnum,
  PossessionTypesEnum,
} from '@app/role/enums/grant-action.eum';

export class GrantDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString({ always: true })
  resource: string;

  @IsEnum(ActionTypesEnum)
  action: ActionTypesEnum;

  @IsEnum(PossessionTypesEnum)
  possession: PossessionTypesEnum;

  @IsPositive()
  userRoleId: number;
}

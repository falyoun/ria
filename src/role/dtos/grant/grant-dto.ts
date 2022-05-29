import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import {
  ActionTypesEnum,
  PossessionTypesEnum,
  RiaResources,
} from '@app/role/enums/grant-action.eum';

export class GrantDto {
  @IsNotEmpty()
  @IsString()
  resource: RiaResources;

  @IsEnum(ActionTypesEnum)
  action: ActionTypesEnum;

  @IsEnum(PossessionTypesEnum)
  possession: PossessionTypesEnum;

  @IsPositive()
  userRoleId: number;
}

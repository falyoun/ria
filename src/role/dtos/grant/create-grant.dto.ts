import { IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import {
  ActionTypesEnum,
  PossessionTypesEnum,
} from '@app/role/enums/grant-action.eum';

export class CreateGrantDto {
  @IsNotEmpty()
  @IsString({ always: true })
  resource: string;

  @IsNotEmpty()
  @IsEnum(ActionTypesEnum)
  action: ActionTypesEnum;

  @IsNotEmpty()
  @IsEnum(PossessionTypesEnum)
  possession: PossessionTypesEnum;

  @IsPositive()
  userId: number;

  @IsPositive()
  roleId: number;
}

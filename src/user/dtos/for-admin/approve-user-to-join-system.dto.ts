import { IsPositive } from 'class-validator';

export class ApproveUserToJoinSystemDto {
  @IsPositive()
  id: number;
  @IsPositive()
  departmentId: number;
}

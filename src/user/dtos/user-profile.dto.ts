import { UserDto } from '@app/user/dtos/user.dto';
import { SalaryScaleJobDto } from '@app/departments/financial/salary-scale/dtos/salary-scale-job.dto';
import { Allow, IsNumber } from 'class-validator';
import { UserLeaveCategoryDto } from '@app/leave/dtos/user-leave-category.dto';

export class UserProfileDto extends UserDto {
  @Allow()
  salaryScaleJob?: SalaryScaleJobDto;
  @IsNumber()
  salary?: number;
  @Allow()
  userLeavesCategories: UserLeaveCategoryDto[];
}

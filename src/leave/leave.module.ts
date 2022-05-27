import { Module } from '@nestjs/common';
import { LeaveController } from '@app/leave/controllers/leave.controller';
import { LeaveService } from '@app/leave/services/leave.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Leave } from '@app/leave/models/leave.model';
import { LeaveCategory } from '@app/leave/models/leave-category.model';
import { LeaveCategoriesService } from '@app/leave/services/leave-categories.service';
import { LeaveCategoryController } from '@app/leave/controllers/leave-category.controller';
import { UserLeaveCategory } from '@app/leave/models/user-leave-category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Leave, LeaveCategory, UserLeaveCategory]),
  ],
  providers: [LeaveService, LeaveCategoriesService],
  controllers: [LeaveController, LeaveCategoryController],
  exports: [LeaveService, LeaveCategoriesService],
})
export class LeaveModule {}

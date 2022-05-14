import { Module } from '@nestjs/common';
import { LeaveController } from '@app/leave/controllers/leave.controller';
import { LeaveService } from '@app/leave/services/leave.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Leave } from '@app/leave/models/leave.model';

@Module({
  imports: [SequelizeModule.forFeature([Leave])],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [LeaveService],
})
export class LeaveModule {}

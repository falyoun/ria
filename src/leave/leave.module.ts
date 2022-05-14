import { Module } from '@nestjs/common';
import { LeaveController } from '@app/leave/controllers/leave.controller';
import { LeaveService } from '@app/leave/services/leave.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Leave } from '@app/leave/models/leave.model';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Leave]), UserModule],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [LeaveService],
})
export class LeaveModule {}

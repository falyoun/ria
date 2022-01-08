import { Module } from '@nestjs/common';
import { HrController } from './controllers';
import { HrService } from './services';

@Module({
  imports: [],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}

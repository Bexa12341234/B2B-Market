import { Module } from '@nestjs/common';
import { POSService } from './pos.service';
import { POSController } from './pos.controller';

@Module({
  providers: [POSService],
  controllers: [POSController],
})
export class POSModule {}

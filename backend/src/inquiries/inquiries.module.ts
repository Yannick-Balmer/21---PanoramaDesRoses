import { Module } from '@nestjs/common';
import { AdminKeyGuard } from './admin-key.guard';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';

@Module({
  controllers: [InquiriesController],
  providers: [InquiriesService, AdminKeyGuard],
})
export class InquiriesModule {}

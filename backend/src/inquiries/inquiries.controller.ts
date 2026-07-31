import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminKeyGuard } from './admin-key.guard';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  async create(@Body() inquiry: CreateInquiryDto) {
    const result = await this.inquiriesService.create(inquiry);
    return {
      success: true,
      message: 'Demande enregistrée et brochure envoyée.',
      inquiryId: result.id,
    };
  }

  @Get('stats')
  @UseGuards(AdminKeyGuard)
  getStats() {
    return this.inquiriesService.getStats();
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  async create(@Body() inquiry: CreateInquiryDto) {
    await this.inquiriesService.send(inquiry);
    return { success: true, message: 'Demande envoyée et brochure transmise.' };
  }
}

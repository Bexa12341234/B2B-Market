import { Controller, Get } from '@nestjs/common';
import { SegmentsService } from './segments.service';

@Controller('segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Get()
  async findAll() {
    return this.segmentsService.findAll();
  }
}

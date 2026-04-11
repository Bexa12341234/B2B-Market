import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { POSService } from './pos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.decorator';

@Controller('pos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.RETAIL)
export class POSController {
  constructor(private posService: POSService) {}

  @Post('sessions')
  async createSession(@Request() req: any, @Body('items') items: any[]) {
    return this.posService.createSession(req.user.userId, items);
  }

  @Get('stock')
  async getStock(@Request() req: any) {
    return this.posService.getMyStock(req.user.userId);
  }

  @Get('sessions')
  async getSessions(@Request() req: any) {
    return this.posService.getSessions(req.user.userId);
  }

  @Delete('sessions/:id')
  async deleteSession(@Param('id') id: string) {
    return this.posService.deleteSession(+id);
  }
}

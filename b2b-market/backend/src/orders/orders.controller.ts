import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @Roles(Role.RETAIL)
  async create(@Request() req: any, @Body() body: any) {
    return this.ordersService.createOrder(req.user.userId, body);
  }

  @Get('retail')
  @Roles(Role.RETAIL)
  async findRetail(@Request() req: any) {
    return this.ordersService.findByRetail(req.user.userId);
  }

  @Get('supplier')
  @Roles(Role.SUPPLIER)
  async findSupplier(@Request() req: any) {
    return this.ordersService.findBySupplier(req.user.userId);
  }

  @Put(':id/status')
  @Roles(Role.SUPPLIER, Role.ADMIN)
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(+id, body.status);
  }
}

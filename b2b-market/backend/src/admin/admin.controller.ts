import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('users')
  async createUser(@Body() data: any) {
    return this.adminService.createUser(data);
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUser(+id, data);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }

  @Post('segments')
  async createSegment(@Body('name') name: string) {
    return this.adminService.createSegment(name);
  }

  @Put('segments/:id')
  async updateSegment(@Param('id') id: string, @Body('name') name: string) {
    return this.adminService.updateSegment(+id, { name });
  }

  @Delete('segments/:id')
  async deleteSegment(@Param('id') id: string) {
    return this.adminService.deleteSegment(+id);
  }

  @Post('categories')
  async createCategory(@Body('name') name: string) {
    return this.adminService.createCategory(name);
  }

  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body('name') name: string) {
    return this.adminService.updateCategory(+id, { name });
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(+id);
  }

  @Get('orders')
  async getOrders() {
    return this.adminService.getAllOrders();
  }
}

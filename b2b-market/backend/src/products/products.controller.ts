import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles(Role.SUPPLIER)
  async create(@Request() req: any, @Body() body: any) {
    return this.productsService.create(body, req.user.userId);
  }

  @Get('my')
  @Roles(Role.SUPPLIER)
  async findMy(@Request() req: any) {
    return this.productsService.findBySupplier(req.user.userId);
  }

  @Get('catalog')
  @Roles(Role.RETAIL)
  async getCatalog(@Request() req: any) {
    return this.productsService.getRetailCatalog(req.user.userId);
  }

  @Put(':id')
  @Roles(Role.SUPPLIER)
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    return this.productsService.update(+id, req.user.userId, body);
  }

  @Delete(':id')
  @Roles(Role.SUPPLIER)
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.productsService.delete(+id, req.user.userId);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }
}

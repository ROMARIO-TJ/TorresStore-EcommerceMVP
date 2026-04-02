import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// El decorador Controller cambia la ruta base a /api/products
@Controller('api/products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getProducts() {
    return this.appService.getProducts();
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductFacebookService } from './product-facebook.service';
import { CreateProductFacebookDto } from './dto/create-product-facebook.dto';
import { UpdateProductFacebookDto } from './dto/update-product-facebook.dto';

@Controller('product-facebook')
export class ProductFacebookController {
  constructor(
    private readonly productFacebookService: ProductFacebookService,
  ) {}

  @Post()
  create(@Body() createProductFacebookDto: CreateProductFacebookDto) {
    return this.productFacebookService.create(createProductFacebookDto);
  }

  @Get()
  findAll() {
    return this.productFacebookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFacebookService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductFacebookDto: UpdateProductFacebookDto,
  ) {
    return this.productFacebookService.update(+id, updateProductFacebookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFacebookService.remove(+id);
  }
}

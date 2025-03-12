import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQuery } from '@app/shopify-api-client/interface/productApi';
import { configPaging } from '@app/shopify-api-client/configQuery';
import { Request, Response } from 'express';
import { ShopifyAuthGuard } from '@app/helper/guard/shopifyMember.guard';
@UseGuards(ShopifyAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  @Post('/product_create')
  async productCreateWebhook(@Req() req: Request, @Res() res: Response) {
    return this.productService.productCreateWebhook(req, res);
  }
  @Post('/delete')
  async productDeleteWebhook(@Req() req: Request, @Res() res: Response) {
    return this.productService.productDelWebhook(req, res);
  }
  @Get()
  findAll(@Query() query: ProductQuery) {
    configPaging(query);
    return this.productService.getProduct(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}

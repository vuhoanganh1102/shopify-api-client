import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductFacebookService } from './product-facebook.service';
import { CreateProductFacebookDto } from './dto/create-product-facebook.dto';
import { UpdateProductFacebookDto } from './dto/update-product-facebook.dto';
import { ShopifyAuthGuard } from '@app/helper/guard/shopifyMember.guard';
import { UserData } from '@app/helper/decorators/user.decorator';
@UseGuards(ShopifyAuthGuard)
@Controller('product-facebook')
export class ProductFacebookController {
  constructor(
    private readonly productFacebookService: ProductFacebookService,
  ) {}

  @Post()
  create(@UserData() user: any) {
    return this.productFacebookService.uploadProducts(user);
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

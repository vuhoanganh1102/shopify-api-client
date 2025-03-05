import { PartialType } from '@nestjs/mapped-types';
import { CreateProductFacebookDto } from './create-product-facebook.dto';

export class UpdateProductFacebookDto extends PartialType(CreateProductFacebookDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateShopifyOauthDto } from './create-shopify-oauth.dto';

export class UpdateShopifyOauthDto extends PartialType(CreateShopifyOauthDto) {}

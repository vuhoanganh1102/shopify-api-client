import { Categories } from './categories.entity';
import { FacebookMemberToken } from './facebookMemberToken.entity';

import { ProductMedia } from './productMedia.entity';
import { Products } from './products.entity';
import { ShopifyMemberToken } from './shopifyMemberToken.enity';
import { SyncDataFromShopifyToApp } from './syncDataFromShopifyToApp.entity';
import { Variants } from './variants.entity';

export const entities = [
  FacebookMemberToken,
  Categories,

  ProductMedia,
  Products,

  Variants,
  ShopifyMemberToken,
  SyncDataFromShopifyToApp,
];

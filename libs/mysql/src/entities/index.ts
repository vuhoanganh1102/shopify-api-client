import { Categories } from './categories.entity';
import { FacebookMemberToken } from './facebookMemberToken.entity';
import { GoogleAccountToken } from './GoogleAccountToken.entity';

import { ProductMedia } from './productMedia.entity';
import { Products } from './products.entity';
import { ShopifyMemberToken } from './shopifyMemberToken.enity';
import { SyncDataFromShopifyToApp } from './syncDataFromShopifyToApp.entity';
import { UpsertItemsToGoogle } from './upsertItemToGG.entity';
import { Variants } from './variants.entity';

export const entities = [
  FacebookMemberToken,
  Categories,

  ProductMedia,
  Products,
  UpsertItemsToGoogle,
  Variants,
  ShopifyMemberToken,
  SyncDataFromShopifyToApp,
  GoogleAccountToken,
];

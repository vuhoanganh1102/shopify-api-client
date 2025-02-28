import { Injectable } from '@nestjs/common';
import { ShopifyApiClientService } from './shopify-api-client.service';
import { ProductQuery } from './interface/productApi';

@Injectable()
export class ProductGraphQLService {
  constructor(private readonly shopifyClient: ShopifyApiClientService) {}
  async getProduct(productQuery: ProductQuery) {
    let customQuery = '';
    if (productQuery.first) {
      customQuery += `first:${productQuery.first},`;
    }
    if (productQuery.after) {
      customQuery += `after:"${productQuery.after}",`;
    }
    if (productQuery.before) {
      customQuery += `before:${productQuery.before},`;
    }
    console.log(customQuery);
    const queryOtion = `query {
    products(${customQuery}) {
      edges {
        node {
          id
          title
          handle
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }`;
    const { data } = await this.shopifyClient.Client.request(queryOtion, {});
    return data;
  }
}

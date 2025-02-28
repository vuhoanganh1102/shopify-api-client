import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAdminApiClient } from '@shopify/admin-api-client';
@Injectable()
export class ShopifyApiClientService {
  private readonly logger = new Logger(ShopifyApiClientService.name);
  private client;
  constructor(private readonly configService: ConfigService) {
    this.client = createAdminApiClient({
      storeDomain: this.configService.get<string>('STORE_DOMAIN'),
      apiVersion: this.configService.get<string>('API_VERSION'),
      accessToken: this.configService.get<string>('ACCESS_TOKEN'),
    });
    if (this.client) {
      this.logger.log('Successfull Init Shopify-api-client!!!');
    }
  }
  get Client() {
    return this.client;
  }
}

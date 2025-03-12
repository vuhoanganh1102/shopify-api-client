import { ShopifyApiClientService } from '@app/shopify-api-client';
import { webhookCreator } from '@app/shopify-api-client/interface/productApi';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ShopifyOauthService } from 'src/shopify-oauth/shopify-oauth.service';

export interface DelInterface {
  id: string;
}
@Injectable()
export class WebhookService {
  constructor(
    private readonly shopifyService: ShopifyApiClientService,
    private readonly shopifyOauthService: ShopifyOauthService,
  ) {}

  // async createWebhook(body: webhookCreator) {
  //   const queryOption = `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
  //       webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
  //         webhookSubscription {
  //           id
  //           topic
  //           filter
  //           format
  //           endpoint {
  //             __typename
  //             ... on WebhookHttpEndpoint {
  //               callbackUrl
  //             }
  //           }
  //         }
  //         userErrors {
  //           field
  //           message
  //         }
  //       }
  //     }`;
  //   // const variables = {
  //   //   topic: 'METAOBJECTS_CREATE',
  //   //   webhookSubscription: {
  //   //     callbackUrl: 'https://example.org/endpoint',
  //   //     format: 'JSON',
  //   //     filter: 'type:lookbook',
  //   //   },
  //   // };
  //   const { data, errors } = await this.shopifyService.Client.request(
  //     queryOption,
  //     { variables: body, retries: 2 },
  //   );
  //   if (errors) {
  //     console.log(errors);
  //   }
  //   return data;
  // }
  async createWebhook(body: any) {
    const result = await axios.post(
      'https://initalstore.myshopify.com/admin/api/2025-01/graphql.json',
      body, // Payload (body request)
      {
        headers: {
          'X-Shopify-Access-Token': process.env.ACCESS_TOKEN, // Correct authentication
          'Content-Type': 'application/json',
        },
      },
    );

    return result.data; // Trả về data thay vì toàn bộ response
  }
  async webhookDeleteSub(body: DelInterface) {
    const queryOption = `mutation webhookSubscriptionDelete($id: ID!) {
      webhookSubscriptionDelete(id: $id) {
        userErrors {
          field
          message
        }
        deletedWebhookSubscriptionId
      }
    }`;
    const { data, errors } = await this.shopifyService.Client.request(
      queryOption,
      { variables: body, retries: 2 },
    );
    if (errors) {
      console.log(errors);
    }
    return data;
  }
}

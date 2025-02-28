import { ShopifyApiClientService } from '@app/shopify-api-client';
import { webhookCreator } from '@app/shopify-api-client/interface/productApi';
import { Injectable } from '@nestjs/common';

export interface DelInterface {
  id: string;
}
@Injectable()
export class WebhookService {
  constructor(private readonly shopifyService: ShopifyApiClientService) {}

  async createWebhook(body: webhookCreator) {
    const queryOption = `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
          webhookSubscription {
            id
            topic
            filter
            format
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`;
    // const variables = {
    //   topic: 'METAOBJECTS_CREATE',
    //   webhookSubscription: {
    //     callbackUrl: 'https://example.org/endpoint',
    //     format: 'JSON',
    //     filter: 'type:lookbook',
    //   },
    // };
    const { data, errors } = await this.shopifyService.Client.request(
      queryOption,
      { variables: body, retries: 2 },
    );
    if (errors) {
      console.log(errors);
    }
    return data;
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

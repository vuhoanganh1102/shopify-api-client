import { ProductQuery, webhookCreator } from './interface/productApi';

export function configPaging(query: ProductQuery) {
  query['first'] = query?.first || 10;
  return;
}

export function configBodyWebhookCreator(body: webhookCreator) {
  body['webhookSubscription']['format'] =
    body?.webhookSubscription?.format || 'JSON';
  body['webhookSubscription']['filter'] =
    body?.webhookSubscription?.filter || 'type:lookbook';
}

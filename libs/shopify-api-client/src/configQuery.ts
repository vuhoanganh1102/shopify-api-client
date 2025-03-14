import {
  ProductQuery,
  ProductQueryDB,
  webhookCreator,
} from './interface/productApi';

export function configPaging(query: ProductQuery) {
  query['first'] = query?.first || 10;
  return;
}
export function assignPaging(params: ProductQueryDB = {}) {
  params.pageSize = Number(params.pageSize) || 10; // Default to 10
  params.pageIndex = Number(params.pageIndex) || 1; // Default to 1
  params.offset = (params.pageIndex - 1) * params.pageSize; // Calculate offset
  params.limit = params.pageSize; // Set limit

  return params;
}

export function configBodyWebhookCreator(body: webhookCreator) {
  body['webhookSubscription']['format'] =
    body?.webhookSubscription?.format || 'JSON';
  body['webhookSubscription']['filter'] =
    body?.webhookSubscription?.filter || 'type:lookbook';
}

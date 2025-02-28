export interface ProductQuery {
  first?: number;
  before?: string;
  after?: string;
  query?: string;
  reverse?: boolean;
  savedSearchId?: string;
  sortKey?: any;
}
export interface webhookSubscription {
  callbackUrl: string;
  format: string;
  filter: string;
}
export interface webhookCreator {
  topic: string;
  webhookSubscription: webhookSubscription;
}

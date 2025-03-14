export interface ProductQuery {
  first?: number;
  before?: string;
  after?: string;
  query?: string;
  reverse?: boolean;
  savedSearchId?: string;
  sortKey?: any;
}

export class ProductQueryDB {
  pageIndex?: number = 1;
  pageSize?: number = 10;
  sortBy?: string;
  orderby?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  keyword?: string;
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

export function returnPaging(
  data: Array<any>,
  totalItems: number,
  params: any,
  metadata = {},
) {
  return {
    hasMore: data?.length >= Number(params?.pageSize),
    pageIndex: Number(params.pageIndex),
    totalPages: Math.ceil(totalItems / params.pageSize),
    totalItems,
    data,
    paging: true,
    metadata,
  };
}

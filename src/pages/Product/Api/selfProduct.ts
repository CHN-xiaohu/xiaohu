import { Request } from '@/foundations/Request';

import type { MiniprogramProductColumns } from './product';

export type SelfProductColumns = {
  minSalePrice: number;
} & MiniprogramProductColumns;

const prefix = '/zwx-product/productinfo/self';

// 商品列表
export const getSelfProducts = async (params: any = {}) =>
  Request.get('/adminPage', {
    prefix,
    params,
  }) as PromiseResponsePaginateResult<SelfProductColumns>;

// 上下架
export const batchUpdateSelfProductState = async (data: {
  ids: string[];
  miniProductState: 1 | 2;
}) => Request.post('/batchUpdateState', { prefix, data });

// 商品详情
export const getSelfProductDetails = async (id: string) => Request.get(`/detail/${id}`, { prefix });

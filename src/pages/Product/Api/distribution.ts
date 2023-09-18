import { Request } from '@/foundations/Request';

import type { SupplyProductColumns } from './supply';

export type DistributionProductColumns = {
  mini: number;
  purchase: number;
} & SupplyProductColumns;

const prefix = '/zwx-product/productinfo/distribution';

// 分页列表
export const getDistributionProducts = async (params: any) =>
  Request.get('/page', {
    prefix,
    params,
  }) as PromiseResponsePaginateResult<DistributionProductColumns>;

export const getDistributionProduct = async (id: string) =>
  Request.get<DistributionProductColumns>(`/detail/${id}`, { prefix });

// 批量上下架
export const batchUpdateDistributionProductState = async (data: {
  ids: string[];
  productState: 1 | 2;
}) => Request.post('/batchUpdateState', { prefix, data });

// 批量修改库存
export const modifyInventoryInBulk = async (data: {
  productInfoIds: string[];
  productType: 0 | 1 | 2 | 3 | 4;
  stock: number;
}) => Request.post('/zwx-product/product/initStocks', { data });

// 批量修改库存预警
export const batchModifyInventoryWarning = async (data: {
  productInfoIds: string[];
  productType: 0 | 1 | 2 | 3 | 4;
  warning: number;
}) => Request.post('/zwx-product/product/initStocksWarning', { data });

// 新增或者是编辑供货商品
export const updateDistributionProduct = async (data: any) =>
  Request.post('/update', { prefix, data });

export const deleteInvalidDistributionProduct = async (params: AnyObject) =>
  Request.delete('/deleteInvalid', { prefix, params });

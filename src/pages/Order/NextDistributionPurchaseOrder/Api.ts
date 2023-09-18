import { Request } from '@/foundations/Request';

// 查询分销的商品列表
export const getDistributionList = (params: any) =>
  Request.get('/zwx-product/productinfo/distribution/page', {
    params,
  }) as PromiseResponsePaginateResult;

// 查询分销的商品详情
export const getProduct = (productInfoId: any) =>
  Request.get(
    `/zwx-product/productinfo/distribution/detail/${productInfoId}`,
    {},
  ) as PromiseResponsePaginateResult;

export const cancelDistributionPurchaseOrder = async (id: string) =>
  Request.get(`/zwx-order/brandSupplierOrder/deleteOrder/${id}`);

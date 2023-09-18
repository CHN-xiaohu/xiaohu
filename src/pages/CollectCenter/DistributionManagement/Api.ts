import { Request } from '@/foundations/Request';

export type IDistributionBelongPageColumns = {
  id: string; //
  name: string; //
  productState: number; //
  image: string; //
  minPurchasePrice: string; //
  maxPurchasePrice: string; //
  minVipPurchasePrice: string; //
  maxVipPurchasePrice: string; //
  minSalePrice: string; //
  maxSalePrice: string; //
  minOrignPrice: string; //
  maxOrignPrice: string; //
  minSupplyPrice: string; //  最小供货价
  maxSupplyPrice: string; //
  purchase: number; // 最大供货价
  mini: number; //
  categoryNamePath: string; //
  createTime: string; //
  updateTime: string; //
  serial: number; //
  chargeUnit: object; //
};

// 渠道自营分销商品列表
export const getDistributionBelongPage = async (params: any) =>
  Request.get('/zwx-product/productinfo/distribution/belongPage', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IDistributionBelongPageColumns>;

// 渠道自营未分销商品列表
export const getShareBelongPage = async (params: any) =>
  Request.get('/zwx-product/productinfo/share/belongPage', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IDistributionBelongPageColumns>;

// 指定供货商分销商品列表
export const getSupplierDistributionBelongPage = async (params: any) =>
  Request.get('/zwx-product/productinfo/distribution/belongAuditPage', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IDistributionBelongPageColumns>;

// 指定供货商未分销商品列表
export const getSupplierShareBelongPage = async (params: any) =>
  Request.get('/zwx-product/productinfo/share/belongAuditPage', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IDistributionBelongPageColumns>;

// 从集采中心分销某个商品
export const distributeCommodity = async (data: any) =>
  Request.post('/zwx-product/productinfo/distribution/distribute', {
    data,
    showSuccessMessage: false,
  });

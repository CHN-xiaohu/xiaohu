/**
 *  供货商品相关接口
 */

import { Request } from '@/foundations/Request';

const prefix = '/zwx-product/shareproductaudit';

export type shareProductColumns = {
  name: string;
  productState: number;
  image: string;
  minSupplyPrice: number;
  maxSupplyPrice: number;
  minSuggestSalePrice: number;
  maxSuggestSalePrice: number;
  minProfitMargin: number;
  maxProfitMargin: number;
  categoryNamePath: string;
  createTime: string;
  updateTime: string;
  serial: number;
  chargeUnit: {
    chargeUnitName: string;
  };
  auditStatus: number;
  auditRemark: string;
};

// 获取商品列表
export const getShareProducts = async (params: any) =>
  Request.get('/selectProductPage', { prefix, params });

// 获取商品详情
export const getShareProductDetail = async (id: string) =>
  Request.get(`/productInfoDetail/${id}`, { prefix });

// 审核通过
export const submitAuditPass = async (id: string) => Request.post(`/passAudit/${id}`, { prefix });

// 审核不通过
export const submitAuditNoPass = async (data: any) =>
  Request.post('/noPassAudit', { prefix, data });

// // 审核记录分页
export const selectAuditLog = async (params: any) =>
  Request.get('/selectAuditPage', { prefix, params });

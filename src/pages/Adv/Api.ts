/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| app广告相关接口
|
*/

import { Request } from '@/foundations/Request';

const prefix = '/zwx-marketing';

const advPrefix = {
  prefix: `${prefix}/advertising`,
};

export type AdvColumns = {
  id: string;
  name: string;
  tenantCode: string;
  flag: number;
  status: number;
  startTime: string;
  endTime: string;
  sort: number;
  location: string;
  terminal: number;
  picUrl: string;
  skipLocation: string;
  skipValue: string;
  skipValueName: string;
  isUsing: boolean;
};

export const getAdvs = async (params: { current: number }) =>
  Request.get<AdvColumns>('/page', { ...advPrefix, params });

export const addAdv = async (data: object) =>
  Request.post<AdvColumns>('/save', { ...advPrefix, data, showSuccessMessage: false });
export const updateAdv = async (data: object) =>
  Request.post<AdvColumns>('/update', { ...advPrefix, data, showSuccessMessage: false });

export const getAdvDetail = async (id: string) =>
  Request.get<AdvColumns>(`/detail/${id}`, { ...advPrefix });

export const deleteAdv = async (id: string) =>
  Request.get<AdvColumns>(`/delete/${id}`, { ...advPrefix });

// 商品查询（商品详情页）
export const getProduct = async (params?: { name: string }) =>
  Request.get('/zwx-product/productinfo/purchase/page', { params });

// // 获取商品详情接口
// export const getProductDetail = async (id: string) => (
//   Request.get('/zwx-product/productinfo/purchase/page', { params: { id } })
// )

// 获取团购详情
export const getGroupDetail = async (id: string) =>
  Request.get('/zwx-marketing/groupPurchase/selectById', { params: { id } });

/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 小程序广告相关接口
|
*/

// 小程序广告列表接口
export const getMiniAdvList = async (params: any) =>
  Request.get('/mini/page', { ...advPrefix, params });

// 获取小程序商品列表接口
export const getMiniProduct = async (params: any) =>
  Request.get('/zwx-product/productinfo/mini/page', { params });

// 获取小程序专题
export const getMiniSpecial = async (name: any) =>
  Request.get(`/zwx-marketing/bizspecialtopic/admin/select?content=${name}`);

// 获取专题详情
export const getTopicDetail = async (id: string) =>
  Request.get(`/zwx-marketing/bizspecialtopic/detail/${id}`);

// 团购列表
export const getGroupPurchase = async (data: any) =>
  Request.post('/zwx-marketing/groupPurchase/selectActivityByCondition', { data });

// 根据业务常量获取页面列表
export const getByBusinessCode = async (params: any) =>
  Request.get(`/zwx-custom/publishDesignSitePage/getByBusinessCode`, { params });

// 获取指定站点的指定页面的配置信息
export const getByBusinessDetail = async (pageId: string) =>
  Request.get(`/zwx-custom/publishDesignSitePage/detail/${pageId}`);

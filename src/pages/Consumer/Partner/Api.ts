import { Request } from '@/foundations/Request';

const prefix = '/zwx-user';

const partner = {
  prefix: `${prefix}/partner`,
};

export type partnerColumns = {
  id: string;
  partnerName: string;
  partnerPhone: string;
  password: string;
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  area: string;
  areaId: string;
  parentAccount: string;
  partnerType: string;
};

export type storeColumns = {
  id: string;
  linkName: string;
};

// 获取合伙人列表
export const getPartnerList = async (params: { current: number }) =>
  Request.get('/page', { ...partner, params });

// 修改合伙人状态
export const updateStatus = async (id: string) =>
  Request.get(`/updateStatus?id=${id}`, { ...partner });

// 商家下拉列表
export const getStoreList = async (content: string) =>
  Request.get(`/storeList?selectField=${content}`, { ...partner });

// 合伙人下拉列表
export const getPartnerDownList = async (content: string) =>
  Request.get(`/listPartner?selectField=${content}`, { ...partner });

// 添加未注册商家的合伙人
export const addNoMerchantPartner = async (data: object) =>
  Request.post('/addUnregiter', { ...partner, data });

// 添加已注册商家的合伙人
export const addIsMerchantPartner = async (params: object) =>
  Request.get('/addRegister', { ...partner, params, showErrorMessage: true });

// 修改合伙人信息
export const updatePartner = async (data: string) => Request.post('/update', { ...partner, data });

// 合伙人线下下的商家信息
export const getOfflineStores = async (params: { current: number }) =>
  Request.get('/selectSoreByPartner', { ...partner, params });

// 解绑合伙人
export const unbindPartner = async (id: string) =>
  Request.get(`/unbindPartner?id=${id}`, { ...partner });

import { Request } from '@/foundations/Request';

const prefixs = '/zwx-marketing';

const couponPrefix = {
  prefix: `${prefixs}/coupon`,
};

const miniCouponPrefix = {
  prefix: `${prefixs}/miniCoupon`,
};

const recordPrefix = {
  prefix: `${prefixs}/couponrecord`,
};

const miniRecordPrefix = {
  prefix: `${prefixs}/miniCouponrecord`,
};

const productPrefix = {
  prefix: '/zwx-product/productinfo',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userPrefix = {
  prefix: '/zwx-user/store',
};

const miniPrefix = {
  prefix: '/zwx-user/user-oauth',
};

export type CouponColumns = {
  id: string;
  name: string;
  platform: number;
  publishType: number;
  quota: number;
  takeEndTime: string;
  takeLimit: number;
  takeStartTime: string;
  type: number;
  used: number;
  usedAmount: string;
  usedDiscount: string;
  validDays: number;
  validEndTime: string;
  validStartTime: string;
  validType: number;
  withAmount: string;
};

export type CategoryColumns = {
  id: string;
  name: string;
  parentId: string;
  categoryId: string;
  serial: string;
  icon: string;
  treeNamePath: string;
};

export type DetailColumns = {
  id: string;
  name: string;
  takeStartTime: string;
  takeEndTime: string;
  withAmount: number;
  usedAmount: number;
  usedDiscount: number;
  validEndTime: string;
  validStartTime: string;
  type: number;
  validType: number;
  minus: any;
  used: number;
  validDays: number;
  productInfoIds: any;
  takeLimit: number;
  publishType: number;
  remark: string;
  categoryId: string;
  quota: number;
  showStatus: number;
};

export type productColumns = {
  image: string;
  name: string;
  categoryNamePath: string;
  chargeUnit: any;
  minPurchasePrice: number;
};

export type recordColumns = {
  userParam1: string;
  userParam2: string;
  validStartTime: string;
  validEndTime: string;
  showStatus: number;
  id: string;
};

export type merchantColumns = {
  storeName: string;
  linkPhone: string;
  hasVip: string;
};

export type StoreColumns = {
  id: string;
  name: string;
  storeName: string;
  linkPhone: string;
};

// 优惠券列表
export const getCouponList = async (
  params: { current?: number; publishType?: 0 | 1 | 2 | 3 } & { [k in string]?: any },
) => Request.get<{ records: CouponColumns[] }>('/page', { ...couponPrefix, params });

export const getCouponValidList = async (
  params: { current?: number; publishType?: 0 | 1 | 2 | 3 } & { [k in string]?: any },
) => Request.get<{ records: CouponColumns[] }>('/pageValid', { ...couponPrefix, params });

// 获取商品
export const getProductList = async (params: { current: number }) =>
  Request.get('/purchase/page', { ...productPrefix, params });

// 添加、修改优惠券
export const editCoupon = async (data: any) => Request.post('/save', { ...couponPrefix, data });

// 获取优惠券详情
export const couponDetail = async (id: string) =>
  Request.get(`/detail?id=${id}`, { ...couponPrefix });

// 获取优惠券记录
export const getCouponRecord = async (params: { current: number }) =>
  Request.get('/page', { ...recordPrefix, params });

// 停止领取优惠券记录
export const stopCouponRecord = async (id: string) =>
  Request.post(`/stop?id=${id}`, { ...recordPrefix });

// 手工停止优惠券
export const stopCoupon = async (id: string) => Request.post(`/stop?id=${id}`, { ...couponPrefix });

// 删除优惠券
export const deleteCoupon = async (id: string) =>
  Request.delete(`/remove?id=${id}`, { ...couponPrefix });

// 获取商家列表接口
export const getMerchantList = async (data: any) =>
  Request.post('/queryStorePage', { ...userPrefix, data, showSuccessMessage: false });

// 管理员派券
export const manualIssues = async (data: any) =>
  Request.post('/issueStoreByAdmin', { ...couponPrefix, data });

// < —————————————————————————————————————— 小程序优惠券 ———————————————————————————————————— >

// 小程序优惠券列表
export const getMiniCouponList = async (params: any) =>
  Request.get('/page', { ...miniCouponPrefix, params });

// 小程序优惠券详情
export const getMiniCouponDetail = async (id: string) =>
  Request.get(`/detail?id=${id}`, { ...miniCouponPrefix });

// 删除小程序
export const delMiniCouponDetail = async (id: string) =>
  Request.get(`/remove?id=${id}`, { ...miniCouponPrefix });

// 添加优惠券
export const saveMiniCoupon = async (data: any) =>
  Request.post('/save', { ...miniCouponPrefix, data });

// 获取商家列表不分页
export const getQueryStore = async (data: any) =>
  Request.post('/queryStore', { ...userPrefix, data, showSuccessMessage: false });

// 获取商家自营商品
export const getMiniProduct = async (params: any) =>
  Request.get('/self/adminCouponPage', { ...productPrefix, params });

// 获取小程序用户列表
export const getMiniUserList = async (data: any) =>
  Request.post('/queryUsersOauthPage', { ...miniPrefix, data, showSuccessMessage: false });

// 管理员派送优惠券
export const miniManualIssues = async (data: any) =>
  Request.post('/issueStoreByAdmin', { ...miniCouponPrefix, data, showSuccessMessage: false });

// 领取优惠券记录
export const getMiniCouponRecord = async (params: { current: number }) =>
  Request.get('/page', { ...miniRecordPrefix, params });

// 停止领取优惠券
export const stopMiniCoupon = async (id: string) =>
  Request.post(`/stop?id=${id}`, { ...miniRecordPrefix });

// 小程序二维码
export const getMiniProgramCouponQR = async (id: string) =>
  Request.post('/zwx-product/wxQrScene/getQr', {
    data: {
      path: `pages/Coupon/Detail/index?id=${id}`,
      // scene: JSON.stringify({ id })
    },
    notAutoHandleResponse: true,
    getResponse: true,
    headers: {
      Accept: '*/*',
    },
  }).then(async (res: any) => {
    const blob = await res.response.clone().blob();
    console.log(blob?.type);
    return blob?.type ? (window.URL || window.webkitURL).createObjectURL(blob) : '';
  });

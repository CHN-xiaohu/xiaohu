import { Request } from '@/foundations/Request';

export type ActivityFormColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: string;
  isDeleted: string;
  tenantCode: string;
  dataId: string;
  publishVer: string;
  designSiteId: string;
  pageType: string;
  name: string;
  pageLevel: string;
  serial: string;
  bookNum: string;
  coverImage: string;
  shareImage: string;
  isPublish: boolean;
};

export type BookingManageColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: string;
  isDeleted: string;
  tenantCode: string;
  distributorId: string;
  storeId: string;
  pageId: string;
  siteId: string;
  store: {
    id: string;
    storeName: string;
    storeImgs: string;
    storeInfo: string;
    lng: string;
    lat: string;
    hasVip: string;
    supplierId: string;
    linkName: string;
    linkPhone: string;
  };
  distributor: {
    name: string;
    account: string;
    phone: string;
  };
  vals: any[];
};

const prefix = '/zwx-custom';

const activityPrefix = {
  prefix: `${prefix}/publishDesignSitePage`,
};

const bookingPrefix = {
  prefix: `${prefix}/valInfoSequence`,
};

const designPrefix = {
  prefix: `${prefix}/templateDesignSite`,
};

const designSitePrefix = {
  prefix: `${prefix}/designSitePage`,
};

export const getActivityFormList = (params: any) =>
  Request.get('/page', { ...designSitePrefix, params });

export const getBookingList = (params: any) => Request.get('/page', { ...bookingPrefix, params });

export const updateActivityStatus = (data: any) =>
  Request.post('/updateStatus', { ...activityPrefix, data });

// 获取模板列表
export const getTemplateDesign = (params: any) => Request.get('/page', { ...designPrefix, params });

// 创建空白页面
export const addEmptyPage = (data: any) => Request.post('/save', { ...designSitePrefix, data });

// 创建站点和页面
export const createSiteAndPage = (data?: { businessCode: string; designType: '0' | '1' }) =>
  Request.post('/zwx-custom/designsite/createSiteAndPage', {
    data: { designType: '1', businessCode: 'GET_CUSTOMER', ...data },
  });

// 选择指定模板
export const chooseTemplate = (data: any) =>
  Request.post('/settleByTemplateId', { ...designSitePrefix, data });

// 设置序号
export const updateSerial = (data: any) =>
  Request.post('/updateSerial', { ...designSitePrefix, data });

export const getActivityQR = async (id: string) =>
  Request.post('/zwx-product/wxQrScene/getQr', {
    data: {
      path: `pages/d/c/i?pageId=${id}`,
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

export const deleteActivity = (id: string) =>
  Request.delete('/zwx-custom/designSitePage/delete', { data: { id } });

import { Request } from '@/foundations/Request';

const prefix = '/zwx-user';

const designerPrefix = {
  prefix: `${prefix}/bizKjlUserEquities`,
};

export type DesignerColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: number;
  isDeleted: string;
  tenantCode: string;
  storeId: string;
  storeName: string;
  registerPhone: string;
  hasVip: number;
  userId: string;
  pageNo: string;
  pageSize: string;
  equities: string;
  selectField: string;
  storeImgs: string;
};

// 获取已注册导购设计师列表
export const getDesignerList = async (data: any) =>
  Request.post('/getRegisteredPage', { ...designerPrefix, showSuccessMessage: false, data });

// 更新商家权益
export const updateEquities = async (data: any) =>
  Request.post('/updateEquitiesById', { ...designerPrefix, data });

// 获取未注册导购设计师列表
export const getUnRegisterDesigner = async (data: any) =>
  Request.post('/getNotRegisteredPage', { ...designerPrefix, data, showSuccessMessage: false });

// 开通导购设计师
export const registerDesigner = async (data: any) =>
  Request.post('/createKjlEquitiesBatch', { ...designerPrefix, data });

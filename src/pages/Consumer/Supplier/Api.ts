import { Request } from '@/foundations/Request';

const supplierPrefix = {
  prefix: '/zwx-user/supplier',
};

export type SupplierColumns = {
  id: string;
  supplierName: string;
  linkName: string;
  linkPhone: string;
  password: string;
  provinceName: string;
  provinceId: string;
  cityName: string;
  cityId: string;
  areaName: string;
  areaId: string;
};

// 获取供应商家列表
export const getSupplierList = async (params: { current: number }) =>
  Request.get('/page', { ...supplierPrefix, params });

// 修改供应商状态
export const changeStatus = async (data: object) =>
  Request.post('/updateSupplierStatus', { ...supplierPrefix, data });

// 添加供应商家信息（未注册商家）
export const addSupplierNoMerchant = async (data: object) =>
  Request.post('/addUnregister', { ...supplierPrefix, data });

// 添加供应商信息（注册过商家）
export const addSupplierIsMerchant = async (data: object) =>
  Request.post('/addRegister', { ...supplierPrefix, data });

// 修改供应商信息
export const updateSupplier = async (data: object) =>
  Request.post('/update', { ...supplierPrefix, data });

// 获取商家信息(下拉列表)
export const getDownStoreList = async (name: string) =>
  Request.get<SupplierColumns[]>(`/storeList?selectField=${name}`, { ...supplierPrefix });

export type StoreUserColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: string;
  isDeleted: string;
  tenantCode: string;
  partnerId: string;
  userId: string;
  storeName: string;
  storeImgs: string;
  storeOrcode: string;
  storeOrcodeRouteUrl: string;
  storeInfo: string;
  linkName: string;
  linkPhone: string;
  password: string;
  payPassword: string;
  provinceId: string;
  cityId: string;
  areaId: string;
  provinceName: string;
  cityName: string;
  areaName: string;
  detailedAddress: string;
  lng: string;
  lat: string;
  hasVip: number;
  vipExpireTime: string;
  categoryId: string;
  remark: string;
  storePhoto1: string;
  storePhoto2: string;
  storePhoto3: string;
  storePhoto4: string;
  categoryNames: string[];
  account: string;
};

// 获取所有商家数据
export const getAllStoreUsers = async () =>
  Request.post<StoreUserColumns[]>('/zwx-user/store/queryStore', {
    data: {},
    showSuccessMessage: false,
  });

// 获取供应商信息(下拉列表)
export const getSuppliers = async (selectField: string) =>
  Request.get<SupplierColumns[]>(`/listSupplier`, { ...supplierPrefix, params: { selectField } });

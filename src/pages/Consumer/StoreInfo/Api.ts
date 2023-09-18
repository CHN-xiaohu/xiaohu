import { Request } from '@/foundations/Request';

export type IStoreInfoColumns = {
  storeName: string; // 商家名称
  storeImgs: string; // 店铺logo   七牛云地址
  linkName: string; // 联系人
  linkPhone: string; // 联系电话
  provinceName: string; // 省
  cityName: string; // 市
  areaName: string; // 区
  provinceId: string; // 省id
  cityId: string; // 市id
  areaId: string; // 区id
  place: any[];
  detailedAddress: string; // 详细地址
  phone: string; // 注册手机号
  storeId: string; // 店铺id
  lng: string;
  lat: string;
};

// 获取商家信息
export const getStoreDefaultInfo = async () =>
  Request.get<IStoreInfoColumns>('/zwx-user/store/storeDefaultInfo');

// 修改/新增品牌商默认店铺信息
export const insertOrUpdateStoreInfo = async (data: any) =>
  Request.post('/zwx-user/store/insertOrUpdateStoreInfo', { data });

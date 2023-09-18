import { Request } from '@/foundations/Request';

import type { StoreUserColumns } from '../Consumer/Supplier/Api';

const prefix = '/zwx-message';

const news = {
  prefix: `${prefix}/news`,
};

export type NewsColumns = {
  id: string;
  userType: number;
  bizType: string;
  title: string;
  shortDescription: string;
  description: string;
  deviceType: string;
  sendWay: string;
  beginDate: string;
  serial: number;
  receiverType: string;
  receiverIds: any[];
};

// 获取消息列表
export const getNewsList = async (params: any) => Request.get('/page', { ...news, params });

// 商品查询（商品详情页）
export const getProduct = async (params?: { name: string }) =>
  Request.get('/zwx-product/productinfo/purchase/page', { params });

// 新增消息推送
export const addNews = async (data: object) => Request.post('/save', { ...news, data });

// 删除消息推送
export const delNew = async (id: any) => Request.delete(`/delete?id=${id}`, { ...news });

// 查看推送信息详情
export const getNewDetail = async (id: string) => Request.get(`/detail?id=${id}`, { ...news });

// 获取商家列表
export const getMerchantList = async (data: AnyObject) =>
  Request.post('/zwx-user/store/queryStorePage', {
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<StoreUserColumns>;

import { Request } from '@/foundations/Request';

import type { ColumnType } from './Constant';

const prefix = '/zwx-marketing/column';

type ColumnPageParams = {
  name?: string;
  type?: ColumnType;
  page?: {
    current: string;
    size: string;
  };
  [key: string]: any;
};

type ColumnProductParams = {
  productName?: string;
  query: {
    current: string;
    size: string;
  };
};

export type ColumnColumn = {
  id: string;
  sort: string;
  name: number;
  type: number;
  createTime: string;
};

export const getColunmList = async (params: ColumnPageParams) =>
  Request.get('/page', { prefix, params });

export const createColumn = async (data: any) =>
  Request.post('/save', { prefix, data, showSuccessMessage: false });

export const getColumnDetail = async (id: string) => Request.get(`/detail/${id}`, { prefix });

export const updateColumn = async (data: any) =>
  Request.post('/update', { prefix, data, showSuccessMessage: false });

export const removeColumn = async (id: string) => Request.delete(`/remove/${id}`, { prefix });

// 栏目商品查询
export const getColumnProduct = async (params: ColumnProductParams) =>
  Request.get('/select', { prefix, params });

// 分类查询（添加分类）
export const getCategories = async (params: { current: number; size: number; content?: string }) =>
  Request.get('/category/page', { prefix, params });

// 商品查询（商品详情页）
export const getProduct = async (params?: { name: string }) =>
  Request.get('/zwx-product/productinfo/purchase/page', { params });

// 团购活动（团购详情页）
export const getGroupPurchase = async (data: any) =>
  Request.post('/zwx-marketing/groupPurchase/selectActivityByCondition', { data });

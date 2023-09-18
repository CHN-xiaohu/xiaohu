import { Request } from '@/foundations/Request';

const prefix = '/zwx-marketing';

const topicPrefix = {
  prefix: `${prefix}/bizspecialtopic`,
};

export type topicColumns = {
  name: string;
  isFirst: boolean;
  sort: number;
  firstPage: boolean;
  productNum: number;
  description: string;
  firstPic: string;
  topicPic: string;
  template: string;
  lists: any;
  id: string;
};

export type productColumns = {
  image: string;
  name: string;
  categoryNamePath: string;
  chargeUnit: any;
  minPurchasePrice: string;
  sort: number;
  id: string;
};

export const getTopicList = async (params: any) => Request.get('/page', { ...topicPrefix, params });

export const deleteTopic = async (params: any) =>
  Request.post('/remove', { ...topicPrefix, params });

// 获取类目
export const getCategoriesValid = async () => Request.get('/zwx-product/productcategory/listValid');

// 获取小程序商品
export const getProductList = async (params: { current: number }) =>
  Request.get('/zwx-product/productinfo/mini/page', { params });

// 添加小程序专题
export const addTopic = async (data: any) => Request.post('/save', { ...topicPrefix, data });

// 修改小程序专题
export const updateTopic = async (data: any) => Request.post('/update', { ...topicPrefix, data });

// 获取专题详情
export const getTopicDetail = async (id: string) =>
  Request.get(`/detail/${id}`, { ...topicPrefix });

/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| app运营类目相关接口
|
*/
import { Request } from '@/foundations/Request';

// const profix = '/zwx-marketing/marketingcategory';

const displayPrefix = {
  prefix: '/zwx-marketing/marketingcategory',
};

const samplePrefix = {
  prefix: '/zwx-marketing/marketingcategorystyle',
};

export type displayCategoryColumn = {
  id: string;
  name: string;
  parentId: string;
  categoryId: string;
  serial: string;
  icon: string;
};

// 查询类目树
export const getCategoryTree = async (params: any) =>
  Request.get<displayCategoryColumn>('/list', { ...displayPrefix, params });

// 添加运营分类
export const addOrUpdateDisplayCategory = async (data: object) =>
  Request.post<displayCategoryColumn>('/save', { ...displayPrefix, data });

// 删除运营类目
export const deleDisplayCategory = async (id: string) => {
  Request.delete<displayCategoryColumn>(`/delete?id=${id}`, { ...displayPrefix });
};

// 设置app类目模板
export const setSample = async (data: any) =>
  Request.post('/settlePurchaseStyle', { ...samplePrefix, data });

// 查询app类目模板样式
export const getTheSample = async () => Request.get('/myPurchaseStyle', { ...samplePrefix });

/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 小程序运营类目相关接口
|
*/

const miniPrefix = {
  prefix: '/zwx-marketing/minimarketingcategory',
};

const miniStypeProfix = {
  prefix: '/zwx-marketing/marketingcategorystyle',
};

// 获取列表
export const getMiniCategoryList = async (params: any) =>
  Request.get('/list', { ...miniPrefix, params });

// 获取类目树
export const getMiniCategoryTree = async () => Request.get('/tree', { ...miniPrefix });

// 新增分类
export const addMiniCategory = async (data: any) => Request.post('/save', { ...miniPrefix, data });

// 删除类目
export const delMiniCategory = async (id: string) =>
  Request.delete(`/delete?id=${id}`, { ...miniPrefix });

// 设置小程序类目模板
export const setMiniSample = async (data: any) =>
  Request.post('/settleMiniStyle', { ...miniStypeProfix, data });

// 获取小程序类目模板
export const getMiniSample = async () => Request.get('/myMiniStyle', { ...miniStypeProfix });

/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 集采中心运营类目相关接口
|
*/

const supplyPrefix = {
  prefix: '/zwx-marketing/shareMarketingCategory',
};

const supplyStypeProfix = {
  prefix: '/zwx-marketing/marketingcategorystyle',
};

// 获取类目列表
export const getSupplyCategory = async (params: any) =>
  Request.get('/list', { ...supplyPrefix, params });

// 获取类目树
export const getSupplyCategoryTree = async () => Request.get('/tree', { ...supplyPrefix });

// 新增、修改类目
export const editSupplyCategory = async (data: any) =>
  Request.post('/save', { ...supplyPrefix, data });

// 删除类目
export const delSupplyCategory = async (id: string) =>
  Request.delete(`/delete?id=${id}`, { ...supplyPrefix });

// 设置运营类目样式
export const setSupplyCategoryStyle = async (data: any) =>
  Request.post('/settleShareStyle', { ...supplyStypeProfix, data });

// 获取运营类目模板
export const getSupplyStyle = async () => Request.get('/myShareStyle', { ...supplyStypeProfix });

import { Request } from '@/foundations/Request';

export type ModelColumns = {
  id: string;
  name: string;
};

const prefix = '/zwx-product';

const commendPrefix = {
  prefix: `${prefix}/productCommodifyMap`,
};

const productPrefix = {
  prefix: `${prefix}/productinfo`,
};

const commodifyPrefix = {
  prefix: '/zwx-kujiale/commodify',
};

// 商品列表（平台上架的小程序商品（不包含采购同步商品、分销商品））
export const getAdminPage = async (params: any = {}) =>
  Request.get('/zwx-product/productinfo/mini/platform', { params });

// 采购商品列表
export const getPurchaseProducts = async (params: any = {}) =>
  Request.get('/purchase/adminPage', { ...productPrefix, params });

// 供货商品列表
export const getSupplyProducts = async (params: any = {}) =>
  Request.get('/share/productPage', { ...productPrefix, params });

// 关联商品模型
export const getProductModels = async (params: any = {}) =>
  Request.get('/page', { ...commendPrefix, params });

// 商品sku列表
export const getProductSkus = async (params: any = {}) =>
  Request.get('/skus', { ...commendPrefix, params });

// 搜索商品模型
export const searchProductModels = async (params: any = {}) =>
  Request.get('/commodifyRelation', { ...commendPrefix, params });

// 添加关联
export const addBindRelated = async (data: any = {}) =>
  Request.post('/bind', { ...commendPrefix, data });

// 取消关联
export const cancelBindRelated = async (params: any = {}) =>
  Request.post('/unbind', { ...commendPrefix, params });

// 模型品牌列表
export const getModelBrands = async () => Request.get('/commodifyBrand', { ...commodifyPrefix });

// 模型分类
export const getModelCategories = async () =>
  Request.get('/commodifyCategory', { ...commodifyPrefix });

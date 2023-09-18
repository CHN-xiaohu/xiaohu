import { Request } from '@/foundations/Request';

const prefix = '/zwx-system/def/product';

export type IServicColumns = {
  id: string;
  serveName: string;
  price: number;
  sort: number;
  topImg: string;
  hasSale: boolean;
  status: boolean;
  createTime: string;
  productType: string;
};

// 服务列表
export const getServices = async (data: object) =>
  Request.post('/queryDefProductDTO', {
    prefix,
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IServicColumns>;

// 服务已经绑定的接口集合
export const getServiceBindMenu = async (defProductId: string) =>
  Request.get<string[]>('/alreadyBoundPath', { prefix, params: { defProductId } });

// 添加服务
export const addServices = async (data: object) =>
  Request.post<IServicColumns>('/createProduct', { prefix, data });

// 服务添加菜单
export const addServiceMenu = async (id: string, list: any[]) =>
  Request.post<IServicColumns>('/addMenuAfterDelete', { prefix, data: { id, list } });

// 修改服务
export const updateServices = async (data: object) =>
  Request.post<IServicColumns>('/updateProduct', { prefix, data });

// 启用或禁用
export const disableOrEnableServices = async (data: object) =>
  Request.post<IServicColumns>('/disableOrEnableProduct', { prefix, data });

const currentPrefix = '/zwx-system/def-product-price';

// 删除服务价格
export const delServicePrice = async (defProductPriceId: string) =>
  Request.delete<IServicColumns>('/deleteDefProductPrice', {
    prefix: currentPrefix,
    data: `defProductPriceId=${defProductPriceId}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

// 添加服务价格
export const addServicePrice = async (data: object) =>
  Request.post<IServicColumns>('/createDefProductPrice', { prefix: currentPrefix, data });

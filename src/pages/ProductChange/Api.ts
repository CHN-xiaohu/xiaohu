import { Request } from '@/foundations/Request';

const prefixs = '/zwx-product';

const ProductsChangeList = {
  prefix: `${prefixs}/shareTaskLog`,
};

// 获取客户预约列表接口
export const getProductsChangeList = async (params: { current: number }) =>
  Request.get('/page', { ...ProductsChangeList, params });

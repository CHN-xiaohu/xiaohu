import { Request } from '@/foundations/Request';

const prefixs = '/zwx-system';

const customerList = {
  prefix: `${prefixs}/companyAppApply`,
};

// 获取客户预约列表接口
export const getCustomerList = async (data: any) =>
  Request.post('/query', { ...customerList, showSuccessMessage: false, data });

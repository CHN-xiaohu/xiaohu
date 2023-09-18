import { Request } from '@/foundations/Request';

const prefix = '/zwx-system/sysTenantDomainSetting';

// 获取域名列表
export const getDomainName = async (params: { tenantCode: number }) =>
  Request.get('/getDomainList', { prefix, params });

// 新增或更新域名
export const createOrUpdateDomainName = async (data: Object) =>
  Request.post('/storeSaveOrUpdateDomain', { prefix, data });

// 删除域名
export const deleteDomainName = async (params: { id: string }) =>
  Request.get('/removeDomain', { prefix, params });

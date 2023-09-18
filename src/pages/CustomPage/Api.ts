import { Request } from '@/foundations/Request';

const prefix = '/zwx-system/sysCustomerPage';

type DomainColumns = {
  createDept: string;
  createTime: string;
  createUser: string;
  domainUrl: string;
  id: string;
  isDeleted: number;
  isHttps: number;
  port: number;
  privateKey: string;
  publicKey: string;
  status: number;
  tenantCode: string;
  type: number;
  updateTime: string;
  updateUser: string;
};

// 获取自定义页面列表数据
export const getCustomerPage = async (data: object) =>
  Request.post('/selectPage', {
    prefix,
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<DomainColumns>;

// 删除自定义页面
export const deleteCustomerPage = async (params: { id: string }) =>
  Request.get('/removeById', { prefix, params });

// 保存或更新pc商城自定义页面
export const updateCustomerPage = async (data: object) =>
  Request.post('/saveOrUpdateCustomerPage', { prefix, data });

// 获取自定义页面详情
export const getCustomerPageDetail = async (params: { id: string }) =>
  Request.get('/selectCustomerPageDetail', { prefix, params });

// 获取域名列表
export const getDomainName = async (params: { tenantCode: string }) =>
  Request.get<DomainColumns[]>('/zwx-system/sysTenantDomainSetting/getDomainList', { params });

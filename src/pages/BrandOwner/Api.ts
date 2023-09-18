import { Request } from '@/foundations/Request';

const prefix = '/zwx-system';

const brandOwner = {
  prefix: `${prefix}/tenant`,
};

const serviceMana = {
  prefix: `${prefix}/def/product`,
};

const productService = {
  prefix: `${prefix}/account-product`,
};

const domainName = {
  prefix: `${prefix}/sysTenantDomainSetting`,
};

const kujiale = {
  prefix: `${prefix}/kjlSetting`,
};

export type BrandOwnerColumns = {
  id: string;
  tenantName: string;
  linkman: string;
  contactNumber: number;
  tenantAccount: string;
  password: string;
  domain: string;
  goldMerchantNumber: number;
  belongChannelInfo: any;
  smsNumber: string;
  address: string;
  mainCategory?: string[];
};

export type ServiceColumn = {
  productName: string;
  createTime: string;
  endTime: string;
};

// 获取品牌商列表
export const getBrandOwnerList = async (params: { current: number }) =>
  Request.get('/page', { ...brandOwner, params });

// 添加、修改品牌商
export const addBrandOwner = async (data: object) =>
  Request.post('/submit', { ...brandOwner, data });

// 修改品牌商列表状态
export const updateStatus = async (data: object) =>
  Request.post('/update_tenant_status', { ...brandOwner, data });

// 获取服务管理列表
export const getServiceManage = async (params: { current: number }) =>
  Request.get('/listOfUserWhoBoundToServices', { ...serviceMana, params });

// 获取服务下拉选项集合
export const getDownServices = async () => Request.get('/defProductSelection', { ...serviceMana });

// 给用户绑定服务
export const createAccountProduct = async (data: object) =>
  Request.post('/createAccountProduct', { ...productService, data });

export type PcDomainColumns = {
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

export type BelongChannelColumns = {
  contactNumber: string; // 手机号
  belongChannel: string; // 所属品牌商id  0 为平台
  tenantName: string; // 品牌商名称
  id: string; // 品牌商id
};

// 获取域名配置
export const getPcDomainName = async (params: { tenantCode: string }) =>
  Request.get('/getDomainList', {
    ...domainName,
    params,
  }) as PromiseResponsePaginateResult<PcDomainColumns>;

// 新增或修改域名配置
export const updatePcDomainName = async (data: object) =>
  Request.post('/saveOrUpdateDomain', { ...domainName, data });

// 保存酷家乐配置
export const saveKujileSetting = async (data: object) =>
  Request.post('/saveOrUpdateSysKjlSetting', { ...kujiale, data });

// 查询酷家乐配置
export const getKujialeSetting = async (params: { tenantCode: string }) =>
  Request.get('/getSysKjlSttingDetail', { ...kujiale, params });

// 获取登录授权码
export const generateCode = async (params: any) =>
  Request.get('/zwx-user/oauth/redirect/oauthCode/generateCode', {
    params,
  });

// 获取所属渠道（下拉框）
export const getBelongChannel = async (params: any) =>
  Request.get('/zwx-system/tenant/getBelongChannel', {
    params,
  });

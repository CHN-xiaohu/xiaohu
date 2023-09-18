import { Request } from '@/foundations/Request';

export type SalesmanColumns = {
  id: string;
  storeId: string;
  storeName: string;
  applyTime: string;
  avatar: string;
  invitationSalesmanName: string;
  invitationSalesmanId: string;
  salesmanName: string;
  registerPhone: string;
  linkPhone: string;
  auditStatus: number;
  auditMsg: string;
  provinceId: string;
  createTime: string;
  cityId: string;
  areaId: string;
  provinceName: string;
  cityName: string;
  areaName: string;
  detailedAddress: string;
  totalSalesman: number;
  totalStoreNum: number;
  totalOrderNum: number;
  totalOrderAmount: number;
  totalProfit: number;
  todayOrderNum: number;
  todayOrderProfitNum: number;
  sysSalesmanRegionalAgentInfos: string;
  sysSalesmanRulesVO: string;
};

export type StoreColumns = {
  id: string;
  storeName: string;
  linkPhone: string;
  salesmanName: string;
  registerPhone: string;
};

export type AchievementReportColumn = {
  id: string;
  name: string;
};

const prefix = '/zwx-user';

const systemPrefix = '/zwx-system';

const order = '/zwx-order';

const salesmanPrefix = {
  prefix: `${prefix}/sysSalesmanManage`,
};

const settingPrefix = {
  prefix: `${systemPrefix}/sysSalesmanSetting`,
};

const orderPrefix = {
  prefix: `${order}/bizextendorderrecord/admin`,
};

const storePrefix = {
  prefix: `${prefix}/store`,
};

// 查询业务员
export const getSalesmanList = (data: any) =>
  Request.post('/querySalesmanPage', { ...salesmanPrefix, data, showSuccessMessage: false });

// 未注册商家申请业务员
export const unRegisterSalesman = (data: any) =>
  Request.post('/unRegisterStoreCreateSalesman', {
    ...salesmanPrefix,
    data,
    showSuccessMessage: false,
  });

// 已注册商家申请业务员
export const registerSalesman = (data: any) =>
  Request.post('/registeredStoreCreateSalesman', {
    ...salesmanPrefix,
    data,
    showSuccessMessage: false,
  });

// 查看业务员详情
export const getSalesmanDetail = (id: string) =>
  Request.get(`/getSalesmanById?id=${id}`, { ...salesmanPrefix });

// 查询未注册业务员商家
export const unRegisterStore = (data: any) =>
  Request.post('/unRegisterSalesmanStore', { ...storePrefix, showSuccessMessage: false, data });

// 编辑业务员
export const editSalesman = (data: any) =>
  Request.post('/editSalesmanById', { ...salesmanPrefix, data });

// 品牌商业务员配置
export const salesmanSetting = (data: any) =>
  Request.post('/saveOrUpdate', { ...settingPrefix, data, showSuccessMessage: false });

// 查看业务员配置
export const getSalesmanSetting = () => Request.get('/getSysSalesmanSetting', { ...settingPrefix });

// 批量审核
export const auditSalesmans = (data: any) =>
  Request.post('/batchAuditSalesman', { ...salesmanPrefix, data });

// 查看品牌商区域业务员列表
export const getTenantRegionalSalesman = (data: any) =>
  Request.post('/getTenantRegionalSalesman', {
    ...salesmanPrefix,
    data,
    showSuccessMessage: false,
  });

// 推广订单
export const getExtendOrders = (params: any) => Request.get('/page', { ...orderPrefix, params });

// 保存品牌商业务员规则说明
export const saveOrUpdateSalesmanRules = (data: any) =>
  Request.post('/saveOrUpdateSalesmanRules', { ...settingPrefix, data, showSuccessMessage: false });

// 获取品牌商业务员招募规则说明
export const getRecruitSalesmanRule = () =>
  Request.get('/getRecruitSalesmanRule', { ...settingPrefix });

// 获取业务员规则说明
export const getSalesmanRulesexPlain = () =>
  Request.get('/getSalesmanRulesexPlain', { ...settingPrefix });

// 保存或更新业务员推广风格设置
export const saveOrUpdateSalesmanExtensionStyle = (data: any) =>
  Request.post('/saveOrUpdateSalesmanExtensionStyle', { ...settingPrefix, data });

// 获取品牌商业务员推广配置
export const getSalesmanExtension = () =>
  Request.get('/getSalesmanExtension', { ...settingPrefix });

// 保存或更新业务员推广配置
export const saveOrUpdateSalesmanExtension = (data: any) =>
  Request.post('/saveOrUpdateSalesmanExtension', { ...settingPrefix, data });

// 更新业务员是否开启
export const updateOpenTypeSalesmanSetting = (type: any) =>
  Request.get(`/updateOpenTypeSalesmanSetting?openType=${type}`, { ...settingPrefix });

// 查询业务员配置是否开始
export const getOpenTypeSalesmanSetting = () =>
  Request.get('/getOpenTypeSalesmanSetting', { ...settingPrefix });

// 获取平台信息（公司名称）
export const getPlatform = async (id: string) => Request.get(`/zwx-system/tenant/detail?id=${id}`);

// 查询上级业务员
export const getSalesmanNotPage = () => Request.get('/getSalesmanNotPage', { ...salesmanPrefix });

// 业务员业务数据
export const getSalesmanIncome = (id: string) =>
  Request.get(`/zwx-order/bizextendorderrecord/statistics/admin/${id}`);

// 区域业务员区域服务配置
export const addAreaSetting = (data: any) =>
  Request.post('/setTenantSalesmanRegionalAgentInfo', { ...salesmanPrefix, data });

// 获取品牌商已被选择区域代理
export const getTenantSelectedRegionalAgentInfos = (id: string) =>
  Request.get(`/getTenantSelectedRegionalAgentInfos?salesmanId=${id}`, { ...salesmanPrefix });

import { Request } from '@/foundations/Request';

const prefix = '/zwx-user';

const merchant = {
  prefix: `${prefix}/store`,
};

const partner = {
  prefix: `${prefix}/partner`,
};

const chargeVip = {
  prefix: `${prefix}/charge-vip-record`,
};

const setVip = {
  prefix: `${prefix}/charge-vip`,
};

const tenant = {
  prefix: '/zwx-system/tenant',
};

export type MerchantColumns = {
  id: string;
  tenantCode: string;
  sysStoreOnlineCode: string;
  storeName: string;
  storePhone: string;
  provinceName: string;
  cityName: string;
  areaName: string;
  partnerId: string;
  provinceId: string;
  cityId: string;
  areaId: string;
  auditStatus: number;
};

export type StoreChargeColumns = {
  storeName: string; // 商家名称
  linkPhone: string; // 注册手机号
  totalMoney: string; // 实付金额
  payWay: number; // 支付方式
  channelTradeNo: string; // 订单交易流水号
  paymentOrderNum: string; // 商户订单号
  updateTime: string; // 操作时间
};

export type SalesmanColumns = {
  registerPhone: string;
  id: string;
  salesmanName: string;
};

// 获取商家列表
export const getMerchantList = async (
  data: AnyObject & { auditStatus?: 0 | 1 | 2; content?: string },
) =>
  Request.post('/queryStorePage', {
    ...merchant,
    showSuccessMessage: false,
    data,
  }) as PromiseResponsePaginateResult<MerchantColumns>;

// 获取商家会员信息
export const getVipMessage = async (data: object) =>
  Request.post('/chargeVipRecordIPage', {
    ...chargeVip,
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<any>;

// 合伙人下拉列表
export const getDownPartners = async (selectField: string) =>
  Request.get(`/listPartner?selectField=${selectField}`, { ...partner });

// 修改门店通商家
export const updateMerchant = async (data: object) =>
  Request.post('/updateStoreInfo', { ...merchant, data });

// 金牌付费商家设置
export const setVipPay = async (data: object) =>
  Request.post('/createOrUpdate', { ...setVip, data });

// 人工充值或续费商家会员信息
export const ChargeVipRecord = async (data: object) =>
  Request.post('/rechargeOrRenewChargeVipRecord', { ...chargeVip, data });

// 金牌商家付费信息
export const ChargeVipDetail = async () => Request.get('/chargeVipDetail', { ...setVip });

// 查看品牌商是否开启审核
export const showAuditIsOpen = async () => Request.get('/queryAuditIsOpen', { ...tenant });

// 更新品牌商是否开启审核
export const updateAuditIsOpen = async (auditIsOpen: number) =>
  Request.get(`/updateAuditStatus?auditIsOpen=${auditIsOpen}`, { ...tenant });

// 商家审核状态修改
export const updateAuditStatus = async (data: object) =>
  Request.post('/updateAuditStatus', { ...merchant, data });

// 业务员信息不分页
export const getSalesmanNotPage = () =>
  Request.get('/zwx-user/sysSalesmanManage/getSalesmanNotPage');

// 取消会员
export const cancelStoreVip = async (data: object) =>
  Request.post('/zwx-user/store/cancelStoreVip', { data });

// 商家会员付费管理列表
export const getStoreChargeRecord = (params: any) =>
  Request.get('/zwx-user/charge-vip-order/storeChargeRecord', {
    params,
  }) as PromiseResponsePaginateResult<StoreChargeColumns[]>;

// 重置密码
export const resetPassword = async (data: any) =>
  Request.post('/zwx-user/store/resetDefaultPassword', { data });

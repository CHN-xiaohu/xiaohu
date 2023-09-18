import { Request } from '@/foundations/Request';

const dataCenterPrefix = {
  prefix: '/zwx-marketing/report',
};

// 商品分析
export type DataCenterColumns = {
  productInfoId: string;
  name: string;
  storeId: string;
  storeName: string;
  reportDate: string;
  vistorNum: string;
  viewNum: string;
  addCartNum: string;
  orderItemNum: string;
  orderPeopleNum: string;
  orderNum: string;
  payItemNum: string;
  transactionNum: string;
  payAmount: string;
  discountAmount: string;
  payEachPrice: string;
  payPeopleNum: string;
  refundNum: string;
  refundAmount: string;
  sourceType: string;
};

// 店铺业绩报表
export type StoreEarningReportColumns = {
  storeName: string;
  storeId: string;
  transactionNum: string;
  payAmount: string;
  saleAmount: string;
  discountAmount: string;
  refundNum: string;
  refundAmount: string;
};

// 业务员业绩分析
export type SalesmanReportColumns = {
  salesmanId: string;
  name: string;
  tenantCode: string;
  waitSettleAmount: string;
  waitInviteAmount: string;
  waitSpreadAmount: string;
  waitSettleOrderNum: string;
  settleAmount: string;
  inviteAmount: string;
  spreadAmount: string;
  settleOrderNum: string;
  fansIncreaseNum: string;
  childIncreaseNum: string;
  reportDate: string;
};

// 分销员业绩分析
export type DistributorReportColumns = {
  distributorId: string;
  name: string;
  tenantCode: string;
  waitSettleAmount: string;
  waitInviteAmount: string;
  waitSpreadAmount: string;
  waitSettleOrderNum: string;
  settleAmount: string;
  inviteAmount: string;
  spreadAmount: string;
  settleOrderNum: string;
  storeIncreaseNum: string;
  childIncreaseNum: string;
  reportDate: string;
};

// 交易分析
export type TransactionColumns = {
  payAmount: string;
  transactionNum: string;
  payPeopleNum: string;
  payItemNum: string;
  orderNum: string;
  refundAmount: string;
  payEachPrice: string;
  orderPeopleNum: string;
  saleAmount: string;
  vistorNum: string;
};

// 商品分析报表
export const getProductAnalysis = async (data: any) =>
  Request.post('/productStatistics', { ...dataCenterPrefix, data, showSuccessMessage: false });

// 店铺业绩报表
export const getStoreEarningReportList = async (data: any) =>
  Request.post('/storeStatistics', { ...dataCenterPrefix, data, showSuccessMessage: false });

// 业务员业绩报表
export const getSalesmanEarningReportList = async (data: any) =>
  Request.post('/salesmanStatistics', { ...dataCenterPrefix, data, showSuccessMessage: false });

// 分销员业绩报表
export const getDistributorEarningReportList = async (data: any) =>
  Request.post('/distributorStatistics', { ...dataCenterPrefix, data, showSuccessMessage: false });

// 交易分析报表
export const getTransactionEarningReportMap = async (data: any) =>
  Request.post('/transationStatistics', { ...dataCenterPrefix, data, showSuccessMessage: false });

import { Request } from '@/foundations/Request';

const prefix = '/zwx-payment';

export type IMerchantBalanceColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: number;
  isDeleted: number;
  tenantCode: string;
  userId: string;
  accountType: number;
  amount: number;
  peas: number;
  state: number;
  withdraw: number;
  storeName: string;
  linkName: string;
  linkPhone: string;
  prohibitWithdrawalDescription?: string;
};

const balancePrefix = `${prefix}/bizuserwallet`;

// 商家余额列表
export const getMerchantBalances = async (params: any) =>
  Request.get<{ records: IMerchantBalanceColumns[] }>('/brand/page', {
    prefix: balancePrefix,
    params,
  });

// 充值
export const chargeMoney = async (data: any) =>
  Request.post<{ records: IMerchantBalanceColumns[] }>('/charge', {
    prefix: balancePrefix,
    data,
    successMessage: '充值成功',
  });

// 扣钱
export const deductMoney = async (data: any) =>
  Request.post<{ records: IMerchantBalanceColumns[] }>('/deduction', {
    prefix: balancePrefix,
    data,
    successMessage: '扣钱成功',
  });

const dwithdrawalPrefix = `${prefix}/bizuserprohibitwithdrawal`;

// 禁止提现
export const prohibitWithdrawal = async (data: any) =>
  Request.post<{ records: IMerchantBalanceColumns[] }>('/save', {
    prefix: dwithdrawalPrefix,
    data,
    successMessage: '禁止提现成功',
  });

// 禁止的详情
export const getProhibitWithdrawalDescription = async (walletId: string) =>
  Request.get<{ remark: string }>('/detail', {
    prefix: dwithdrawalPrefix,
    params: { walletId },
  });

// 恢复提现
export const restoretWithdrawal = async (data: any) =>
  Request.post<{ records: IMerchantBalanceColumns[] }>('/remove', {
    prefix: dwithdrawalPrefix,
    data,
    successMessage: '恢复提现成功',
  });

const drawcashPrefix = `${prefix}/bizuserwalletdrawcash`;

export type IMerchantBalanceDetailsColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: number;
  isDeleted: number;
  walletId: string;
  cashType: number;
  cashTypeValue: string;
  walletInout: number;
  amount: number;
  amountLeft: number;
  orderId: string;
  recordId: string;
  operatorUsername: string;
  remark: string;
  paymentOrderNum: string; // 商户订单号
  channelTradeNo: string; // 交易流水号
};

// 钱包明细
export const getMerchantBalanceDetails = async (
  params: { walletId: string } & { [k in string]?: any },
) =>
  Request.get('/page', { prefix: drawcashPrefix, params }) as PromiseResponsePaginateResult<{
    records: IMerchantBalanceColumns[];
  }>;

// 商家储值卡余额明细
export const getMerchantStoredValueBalanceDetails = async (
  params: { walletId: string } & { [k in string]?: any },
) =>
  Request.get('/bizstoredvaluerecord/page', { prefix, params }) as PromiseResponsePaginateResult<{
    records: IMerchantBalanceColumns[];
  }>;

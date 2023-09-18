import { Request } from '@/foundations/Request';

const prefix = '/zwx-payment';

const accountPrefix = `${prefix}/bizuserwalletdrawcash`;

export type AccountColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: string;
  isDeleted: string;
  walletId: string;
  cashType: number;
  cashTypeValue: number;
  walletInout: number;
  amount: number;
  amountLeft: number;
  orderId: string;
  recordId: string;
  operatorUsername: string;
  remark: string;
  inoutType: number;
};

// 品牌商钱包明细
export const getBrandWalletDetail = async (params: any) =>
  Request.get('/tenant/page', { prefix: accountPrefix, params });

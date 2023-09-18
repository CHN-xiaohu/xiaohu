import { Request } from '@/foundations/Request';

const prefix = '/zwx-payment/bizstoredvaluemanagement';

export type IStoredValueColumn = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  activeStatus: number;
  isUsing: boolean;
  lists: any[];
};

export type IStatisticsColumn = {
  totalRechargeAmountMoney: string; // 充值金额总数
  totalAmountAccountMoney: string; // 到账金额总数
  totalCreditMoney: string; // 赠送金额总数
  totalStoreRecharge: number; // 充值商家总数
  totalRecharge: number; // 充值笔数
};

export type IStoreValueActivitiesDetailColumn = {
  eventName: string; // 活动名称
  storeName: string; // 店铺名称
  linkPhone: string; // 注册手机号
  amount: string; // 充值金额
  give: string; // 赠送金额
  accountAmount: string; // 到账金额
  channelCode: string; // 支付方式
  merchantOrderNum: string; // 交易流水号
  channelTradeNo: string; // 商户订单号
  createTime: string; // 充值时间
};

// 列表
export const getStoredValues = async (params: object) =>
  Request.get('/page', { prefix, params }) as PromiseResponsePaginateResult<IStoredValueColumn>;

// 创建
export const addStoredValue = async (data: any) =>
  Request.post<IStoredValueColumn>('/save', { prefix, data });

// 更新
export const updateStoredValue = async (data: object) =>
  Request.post<IStoredValueColumn>('/update', { prefix, data });

// 删除
export const delStoredValue = async (ids: string) =>
  Request.post<IStoredValueColumn>('/remove', { prefix, params: { ids } });

// 详情
export const showStoredValue = async (id: string) =>
  Request.get<IStoredValueColumn>(`/detail/${id}`, { prefix });

// 活动充值统计
export const getStatistics = async (params: object) =>
  Request.get('/getStatistics', {
    prefix,
    params,
  }) as PromiseResponsePaginateResult<IStatisticsColumn>;

// 某个储值活动的充值明细
export const getStoreValueActivitiesDetail = async (params: object) =>
  Request.get('/storeValueActivitiesDetail', {
    prefix,
    params,
  }) as PromiseResponsePaginateResult<IStoreValueActivitiesDetailColumn>;

import { Request } from '@/foundations/Request';

export type ISalesOrderPaymentColumns = {
  orderSn: string;
  payWay: string;
  channelTradeNo: string;
  paymentOrderNum: string;
  paymentAmount: string;
  refundAmount: string;
  paymentStatus: string;
  orderStatus: number;
  createTime: string;
  payTime: string;
};

// 销售单支付明细列表
export const getSalesOrderPaymentDetails = async (params: any) =>
  Request.get('/zwx-order/bizminiorder/brand/salesOrderPaymentDetails', {
    params,
  }) as PromiseResponsePaginateResult<ISalesOrderPaymentColumns>;

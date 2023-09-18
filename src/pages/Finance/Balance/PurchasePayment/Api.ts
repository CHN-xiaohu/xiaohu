import { Request } from '@/foundations/Request';

export type IOrderPaymentColumns = {
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

export type IcreateExportReportTaskColumns = {
  conditionName?: string; //	 查询条件：模糊查询
  conditionOrderType?: string; //	 查询条件：订单类型
  conditionStartTime?: string; //	 查询条件：时间段
  conditionEndTime?: string; //	 查询条件：结束时间段
  reportType: number; //	 报表类型  1 采购单支付记录 2 销售单支付记录
};

// 采购单支付明细列表
export const getPurchaseOrderPaymentDetails = async (params: any) =>
  Request.post('/zwx-order/bizsalesorder/brand/purchaseOrderPaymentDetails', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IOrderPaymentColumns>;

// 导出报表
export const createExportReportTask = async (data: IcreateExportReportTaskColumns) =>
  Request.post('/zwx-system/brand/export/createExportReportTask', {
    data,
  });

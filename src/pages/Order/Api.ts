/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 采购单相关接口
|
*/

import { Request } from '@/foundations/Request';

const orderPrefix = '/zwx-order';

const purchaseOrderPrefix = `${orderPrefix}/bizsalesorder`;

const printPrefix = '/zwx-system';

const printOrderPrefix = `${printPrefix}/printferManagement`;

export type PurchaseOrderColumns = {
  id: string;
  sn: string;
  isParentOrder: boolean;
  parentId: string;
  status: number;
  customerName: string;
  customerPhone: string;
  province: string;
  city: string;
  area: string;
  street: string;
  address: string;
  provinceId: string;
  cityId: string;
  areaId: string;
  streetId: string;
  payWay: number;
  orderBill: any;
  originalMoney: string;
  totalMoney: string;
  createTime: string;
  couponMoney: string;
  groupType: number;
  distribution: boolean;
  fromBrand: string;
  contactNumber: string;
  purchaseOrderSn: string;
  tenantName: string;
  supplierName: string;
  supplierPhone: string;
  brandSupplierOrderId: string;
  childListOrder: any;
  purchaseActivityVO: {
    showStatus: number;
    price: number;
    bizGroupPurchaseConditions: any;
    status: number;
  };
  brandInfo: {
    contactNumber: string;
    tenantName: string;
  };
  productList: {
    productName: string;
    isDelivery: number;
    productMoney: string;
    productNum: number;
    brandSupplierOrderId: string;
    distribution: boolean;
    chargeVO: {
      chargeWay: number;
      chargeUnitName: string;
      formula: string;
      attrs: { attrName: string; attrUnitName: string; attrVal: string }[];
    };
  }[];
  logList: any;
  orderStatus: number;
  isRefund: boolean;
  childList: PurchaseOrderColumns[];
  isShowDistributionButton: boolean;
  store: { storeName: string; linkPhone: string };
  supplier: {
    supplierName?: string;
  };
  express?: {
    id: string;
    purchaseOrderId: string;
    purchaseOrderProductId: string;
    logisticsName: string;
    information: string;
    messageType: number;
    productName: string;
    picUrl: string;
    productPropVal: string;
    productNum: number;
    productChargeUnitName: string;
  }[][];
  newOrderExpressMap?: {
    id: string;
    purchaseOrderId: string;
    purchaseOrderProductId: string;
    logisticsName: string;
    information: string;
    messageType: number;
    productName: string;
    picUrl: string;
    productPropVal: string;
    productNum: number;
    productChargeUnitName: string;
  }[][];
  orderExpressMap?: {
    id: string;
    purchaseOrderId: string;
    purchaseOrderProductId: string;
    logisticsName: string;
    information: string;
    messageType: number;
    productName: string;
    picUrl: string;
    productPropVal: string;
    productNum: number;
    productChargeUnitName: string;
  }[][];
  orderExpress?: {
    id: string;
    purchaseOrderId: string;
    purchaseOrderProductId: string;
    logisticsName: string;
    information: string;
    messageType: number;
    productName: string;
    picUrl: string;
    productPropVal: string;
    productNum: number;
    productChargeUnitName: string;
  }[][];
  remark: string;
};

export const getPurchaseOrderList = async (params: any) =>
  Request.get('/admin/page', {
    prefix: purchaseOrderPrefix,
    params,
  }) as PromiseResponsePaginateResult<PurchaseOrderColumns>;

export const getOrderDetail = async (id: string) =>
  Request.get<PurchaseOrderColumns>(`/new/detail/${id}`, { prefix: purchaseOrderPrefix });

export const updateOrderDetail = async (data: { id: string } & Record<string, any>) =>
  Request.post('/update', { prefix: purchaseOrderPrefix, data });

export const orderCancel = async (data: { id: string; reason: string }) =>
  Request.post('/cancel', { prefix: purchaseOrderPrefix, data });

// 订单商品退款
export const orderRefund = async (data: any) =>
  Request.post('/sectional/refund', { prefix: purchaseOrderPrefix, data });

// 订单发货
export const deliveryShip = async (data: any) =>
  Request.post('/bizsalesorderexpress/save', { prefix: orderPrefix, data });

// 修改发货信息
export const updateDeliveryInfo = async (data: any) =>
  Request.post('/bizsalesorderexpress/update', { prefix: orderPrefix, data });

// 打印采购单
export const printOrder = async (params: any) =>
  Request.get(`/printfOrder/`, {
    prefix: printOrderPrefix,
    params,
  });

export type LogColumn = {
  sn: number;
  type: string;
  content: string;
  orderType: string;
  createTime: string;
};

// 订单日志
export const getOrderLogByOrderId = async (id: string) =>
  Request.get<LogColumn[]>(`/getLog/${id}`, { prefix: `${orderPrefix}/bizsalesorderlog` });

// 订单备注
export const addOrderLogRemark = async (data: any) =>
  Request.post<LogColumn[]>(`/save`, { prefix: `${orderPrefix}/bizsalesorderlog`, data });

/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 小程序订单相关接口
|
*/

const salesPrefix = '/zwx-order';

const salesOrderPrefix = `${salesPrefix}/bizminiorder`;

export type SalesOrderColumns = {
  id: string;
  sn: string;
  status: number;
  customerName: string;
  customerPhone: string;
  province: string;
  city: string;
  area: string;
  street: string;
  address: string;
  payWay: number;
  orderBill: any;
  originalMoney: string;
  totalMoney: string;
  createTime: string;
  couponMoney: string;
  groupType: number;
  productList: {
    productName: string;
    isDelivery: number;
    productMoney: string;
    productNum: number;
    distribution: boolean;
    chargeVO: {
      chargeWay: number;
      chargeUnitName: string;
      formula: string;
      attrs: { attrName: string; attrUnitName: string; attrVal: string }[];
    };
  }[];
  logList: any;
  orderStatus: number;
  isRefund: boolean;
  childList: PurchaseOrderColumns[];
  store: { storeName: string };
  supplier: {
    supplierName?: string;
  };
  newOrderExpressMap?: {
    id: string;
    purchaseOrderId: string;
    purchaseOrderProductId: string;
    logisticsName: string;
    information: string;
    messageType: number;
    productName: string;
    picUrl: string;
    productPropVal: string;
    productNum: number;
    productChargeUnitName: string;
  }[][];

  orderExpressMap?: {
    id: string;
    purchaseOrderId: string;
    purchaseOrderProductId: string;
    logisticsName: string;
    information: string;
    messageType: number;
    productName: string;
    picUrl: string;
    productPropVal: string;
    productNum: number;
    productChargeUnitName: string;
  }[][];
  remark: string;
};

// 获取销售订单
export const getSalesOrderList = async (params: { current: number }) =>
  Request.get('/admin/page', {
    prefix: salesOrderPrefix,
    params,
  }) as PromiseResponsePaginateResult<PurchaseOrderColumns>;

// 获取销售订单详情
export const getSalesOrderDetail = async (id: string) =>
  Request.get(`/pc/detail/${id}`, { prefix: salesOrderPrefix });

// 销售单发货
export const salesOrderDeliveryShip = async (data: any) =>
  Request.post('/bizminiorderexpress/save', { prefix: salesPrefix, data });

// 销售单取消
export const cancelSalesOrder = async (data: any) =>
  Request.post('/cancel', { prefix: salesOrderPrefix, data });

// 销售单退款
export const refundSalesOrder = async (data: any) =>
  Request.post('/section/refund', { prefix: salesOrderPrefix, data });

// 销售单日志
export const getSalesOrderLog = async (id: string) =>
  Request.get(`/bizminiorderlog/getLog/${id}`, { prefix: salesPrefix });

// 更新销售单发货信息
export const updateExpressMessage = async (data: any) =>
  Request.post('/bizminiorderexpress/update', { prefix: salesPrefix, data });

// 更新收货人信息
export const updateOptainMessage = async (data: any) => {
  Request.post('/update', { prefix: salesOrderPrefix, data });
};

// 更新销售单备注
export const updateSalesOrderRemark = async (data: any) =>
  Request.post('/bizminiorderlog/save', { prefix: salesPrefix, data });

/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 供货单相关接口
|
*/

const supplyOrderPrefix = `${salesPrefix}/brandSupplierOrder`;
const walletPrefix = '/zwx-payment/bizuserwallet';
const supplyOrderExpress = `${salesPrefix}/brandSupplierOrderExpress`;

// 创建供货单
export const addSupplierOrder = async (data: any) =>
  Request.post('/save', { prefix: supplyOrderPrefix, data, showSuccessMessage: false });

// 创建供货单
export const createBrandSupplierOrder = async (data: any) =>
  Request.post('/zwx-order/brandSupplierOrder/createBrandSupplierOrder', {
    data,
  });

// 分销供货单详情
export const brandSupplyOrderDetail = async (id: string) =>
  Request.get(`/supplier/detail/${id}`, { prefix: supplyOrderPrefix });

// 分销采购单详情
export const supplyOrderDetail = async (id: string) =>
  Request.get(`/detail/${id}`, { prefix: supplyOrderPrefix, showSuccessMessage: false });

// 第三方支付
export const paySupplyOrder = async (data: any) =>
  Request.post('/pay', { prefix: supplyOrderPrefix, data, showSuccessMessage: false });

// 供货单第三方支付结果查询
export const getPayResult = async (id: string) =>
  Request.get(`/pay/query/${id}`, { prefix: supplyOrderPrefix });

export const couponPay = async (data: any) => Request.post('/pay', { prefix: walletPrefix, data });

// 供货单列表，品牌商自己下单视觉
export const getSupplierOrders = async (params: any) =>
  Request.get('/self/page', { prefix: supplyOrderPrefix, params });

// 供货单列表，供货商视觉
export const getBrandSupplierOrders = async (params: any) =>
  Request.get('/brand/page', { prefix: supplyOrderPrefix, params });

// 供货单取消
export const cancelSupplierOrder = async (data: any) =>
  Request.post('/cancel', { prefix: supplyOrderPrefix, data });

// 分销采购单日志
export const getSupplierOrderLog = async (id: string) =>
  Request.get(`/brandSupplierOrderLog/getLog/${id}`, { prefix: salesPrefix });

// 分销供货单日志
export const getBrandSupplierOrderLog = async (id: string) =>
  Request.get(`/brandSupplierOrderLog/supplier/getLog/${id}`, { prefix: salesPrefix });

// 供货单发货
export const supplierOrderExpress = async (data: any) =>
  Request.post('/save', { prefix: supplyOrderExpress, data });

// 修改订单备注，地址等
export const editSupplyOrderMessage = async (data: any) =>
  Request.post('/update', { prefix: supplyOrderPrefix, data });

// 供货商商品退款
export const refundSupplierOrder = async (data: any) =>
  Request.post('/sectional/refund', { prefix: supplyOrderPrefix, data });

export const updateSupplierOrderExpress = async (data: any) =>
  Request.post('/update', { prefix: supplyOrderExpress, data });

// 分销采购单-确认收货
export const supplierOrderConfirm = async (id: string) =>
  Request.get(`/zwx-order/brandSupplierOrder/supplierOrderConfirm/${id}`);

/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 爱购云供货单相关接口
|
*/
// 查询所有供货单
export const getAllBrandSupplyOrder = async (params: any) =>
  Request.get('/brand/queryAllBrandPage', { prefix: supplyOrderPrefix, params });

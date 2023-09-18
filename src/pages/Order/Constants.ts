export const orderStatusMap = {
  1: '待支付',
  2: '已取消',
  3: '待发货',
  4: '已发货',
  5: '待收货',
  6: '已完成',
  7: '退款中',
};

export const orderStatusColorMap = {
  1: 'wait-warning',
  2: 'error',
  3: 'processing',
  4: 'cyan',
  5: 'wait-geekblue',
  6: 'success',
  7: 'wait-geekblue',
};

export const orderType = {
  1: '采购单',
  2: '团购单',
};

export const getOrderStatusColor = (type: number, def = 'default') =>
  orderStatusColorMap[type] || def;
export const getOrderStatus = (type: number, def = '枚举或字段缺失') => orderStatusMap[type] || def;
export const orderIsCancel = (type: number) => [2, 4, 5, 6].includes(Number(type));

// 产品： 订单状态为：待发货、已发货 ，支付状态：已支付，订单显示【发货按钮】、【退款按钮】
export const canShowDeliveryButton = (type: number) => [3, 4].includes(type);

export const transformOrderStatusToLabelValue = Object.keys(orderStatusMap).map((value) => ({
  value,
  label: orderStatusMap[value],
}));

export const transformOrderTypeToLabelValue = Object.keys(orderType).map((value) => ({
  value,
  label: orderType[value],
}));

export const isWaitPay = (type: number) => type === 1;
export const isReturning = (type: number) => type === 7;
export const isWaitingForReceipt = (type: number) => type === 5;

// 是否是手动下的分销采购单
export const isManuallyDistributePurchaseOrder = (type: number) => type === 3;

export const orderTypeMap = {
  1: '平台采购单',
  2: '收款单',
};

export const salesOrderTypeMap = {
  1: '平台销售单',
  2: '退款单',
  3: '收款单',
};

export const Otype = {
  1: '采购单',
  2: '小程序订单',
  3: '分销采购单',
  4: '分销供货单',
};

export const orderLogTypeMap = {
  1: '订单创建',
  2: '采购单支付',
  3: '采购单取消',
  4: '采购单发货',
  5: '采购单退款',
  6: '采购单确认',
  7: '采购单备注',
  8: '团购单退差价',
  9: '销售订单结算',
};

export const payWayMap = {
  1: '储值卡余额',
  2: '钱包',
  3: '支付宝',
  4: '微信',
};

export const deliveryMap = {
  0: '未发货',
  1: '已发货',
  2: '已退款',
  3: '退款中',
};

export const deliveryTypeMap = {
  1: '快递公司',
  2: '同城配送',
};

// 省略符
export const ELLIPSIS = '--';

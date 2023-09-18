export const orderStatusMap = {
  1: '待支付',
  2: '已取消',
  3: '待发货',
  4: '已发货',
  5: '待收货',
  6: '已完成',
  7: '退款中',
};

export const orderInOrOut = {
  1: '入账中',
  2: '已入账',
  3: '已失效',
};

export const orderInOrOutStyle = {
  1: '#4CDB4C',
  2: '#FF4141',
  3: '',
};

export const modelNamespace = 'salesman' as 'salesman';

export const getOrderStatus = (type: number, def = '枚举或字段缺失') => orderStatusMap[type] || def;
export const getOrderInOrOut = (type: number, def = '枚举或字段缺失') => orderInOrOut[type] || def;
export const getOrderInOrOutStyle = (type: number, def = '枚举或字段缺失') =>
  orderInOrOutStyle[type] || def;

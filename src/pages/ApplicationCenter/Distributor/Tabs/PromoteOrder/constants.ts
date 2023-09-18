export const orderStatusMap = {
  1: '待结算',
  2: '已结算',
  3: '已取消',
};

export const orderStatusColorMap = {
  1: 'wait-warning',
  2: 'success',
  3: 'error',
};

export const transformOrderStatusToLabelValue = Object.keys(orderStatusMap).map((value) => ({
  value,
  label: orderStatusMap[value],
}));

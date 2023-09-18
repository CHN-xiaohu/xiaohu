import { transformToSelectOptions } from '@/utils';

export const stateMap = {
  1: '可用',
  2: '禁用',
};

export const isDisabled = (type: number) => type !== 1;

export const walletInoutMap = {
  1: '收入',
  '-1': '支出',
};

export const cashTypeValueMap = {
  1: 'ADMIN_RECHARGE_WALLET',
  2: 'ADMIN_DEDUCTION_WALLET',
  3: 'PEAS_CHARGE',
  4: 'PURCHASE_ORDER_PAY',
  5: 'WITHDRAWAL',
};

// @see http://120.79.18.38:41691/project/25/interface/api/1085
export const walletCashTypeMap = {
  1: '后台充值钱包',
  2: '后台扣减钱包余额',
  3: '钱包充值储蓄卡',
  4: '采购单支付',
  11: '采购单退款',

  // 5: '钱包余额提现',
  // 8: '提现失败退回',
};

export const walletCashTypeSelectOptions = transformToSelectOptions(walletCashTypeMap);

// @see http://120.79.18.38:41691/project/25/interface/api/1790
export const cashTypeMap = {
  1: '储值卡充值',
  2: '采购单退款',
  4: '后台储蓄卡充值',
  5: '后台扣减储蓄卡余额',
  3: '储蓄卡余额支付采购单',

  // 32: '储值卡充值',
};

export const cashTypeSelectOptions = transformToSelectOptions(cashTypeMap);

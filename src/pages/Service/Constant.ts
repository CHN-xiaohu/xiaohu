import { transformToSelectOptions } from '@/utils';

export const belongsToMap = {
  AI_GOU_CLOUD: '咋装云后台',
  BRAND_STORE: '品牌商后台',
  STORE: '商家后台',
  SUPPLIER: '供应商后台',
  PARTNER: '合伙人后台',
  CHANNEL_AGENT: '渠道代理后台',
};

export const productTypeMap = {
  BASE: '基础服务',
  APPRECIATION: '增值服务',
  VIRTUAL_SERVE: '虚拟服务',
};

export const virtualServeTypeMap = {
  0: 'GOLD',
  1: 'SMS',
};

export const belongsToMapTransformToSelectOptions = transformToSelectOptions(belongsToMap);
export const productTypeMapTransformToSelectOptions = transformToSelectOptions(productTypeMap);

// @see https://www.tapd.cn/23571741/bugtrace/bugs/view/1123571741001004656
export const disableSaleStatus = (value: keyof typeof belongsToMap) =>
  ['STORE', 'SUPPLIER', 'PARTNER'].includes(value);

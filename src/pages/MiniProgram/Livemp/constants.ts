import { invertObject, transformToSelectOptions } from '@spark-build/web-utils';

export const liveStatusMap = {
  101: '直播中',
  102: '未开始',
  103: '已结束',
  104: '禁播',
  105: '暂停',
  106: '异常',
  107: '已过期',
} as const;

const liveStatusReverseMap = invertObject(liveStatusMap);
export const canShowShare = (t: number) =>
  [liveStatusReverseMap.未开始, liveStatusReverseMap.直播中, liveStatusReverseMap.暂停].includes(
    t as any,
  );

export const canEditLiveRoom = (t: number) => liveStatusReverseMap.未开始 === t;

export const liveIsEnd = (t: number) => t === liveStatusReverseMap.已结束;

export const productAuditStatus = {
  0: '未审核',
  1: '审核中',
  2: '审核通过',
  3: '审核失败',
} as const;

export const productAuditStatusInvertMap = invertObject(productAuditStatus);

export const priceTypeMap = {
  1: '一口价', // （只需要传入price，price2不传）
  2: '价格区间', // price 字段为左边界，price2 字段为右边界，price 和 price2 必传
  3: '显示折扣价', // price 字段为原价，price2 字段为现价， price 和 price2 必传
} as const;

export const priceTypeInvertMap = invertObject(priceTypeMap);
export const priceTypeSelectOptions = transformToSelectOptions(priceTypeMap);

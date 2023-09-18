import { transformToSelectOptions } from '@/utils';

export const activeStatusMap = {
  1: '未生效',
  2: '生效中',
  3: '已过期',
};

export const activeStatusSelectOptions = transformToSelectOptions(activeStatusMap);

export const hideEditButton = (type: number) => type === 3;

export const disableUpdateStartTimeAndEndTime = (type: number) => type === 2;

import { transformPennyToDecimal } from '@/utils';
import {
  generateDefaultSelectOptions,
  convenientDateRangeSchema,
} from '@/components/Business/Formily/Utils/FieldDefaultSchema';

import type { IMerchantBalanceDetailsColumns } from '../../Api';

import { cashTypeSelectOptions } from '../../Constant';

export const formatResult = (res: any) => ({
  total: res.data.total,
  data: (res.data.records as IMerchantBalanceDetailsColumns[]).map((item) => {
    item.amount = transformPennyToDecimal(item.amount) as any;
    item.amountLeft = transformPennyToDecimal(item.amountLeft) as any;

    Object.keys(item).forEach((k) => {
      if (item[k] === -1 || item[k] === '-1') {
        item[k] = '--';
      }
    });

    return item;
  }),
});

export const searchPropsItems = ({
  timeTitle = '流水时间',
  cashTypeOptions = cashTypeSelectOptions,
}: {
  timeTitle?: string;
  cashTypeOptions?: { label: string; value: any }[];
}) =>
  [
    {
      cashType: {
        title: '明细类型',
        type: 'string',
        default: '',
        enum: generateDefaultSelectOptions(cashTypeOptions, ''),
        col: 8,
        'x-component-props': {
          placeholder: '请选择',
        },
      },
      '[startTime,endTime]': convenientDateRangeSchema({ title: timeTitle }),
    },
  ] as any;

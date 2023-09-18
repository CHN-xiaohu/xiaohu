import type { TSchemas } from '@/components/Business/Formily';

import { formTypes } from './Common';

// 禁止提现
export const withdrawalProhibitedFields: TSchemas = {
  [formTypes.prohibitWithdrawal]: {
    type: 'virtualBox',
    visible: false,
    properties: {
      prohibitType: {
        type: 'string',
        default: 'PERSONAL',
        display: false,
      },
      '[startTime,endTime]': {
        title: '禁止时间',
        type: 'convenientDateRange',
        'x-rules': { required: true, message: '请选择禁止时间' },
        'x-component-props': {
          shortcuts: [],
        },
      },
      remark: {
        title: '禁止原因',
        type: 'textarea',
        'x-rules': [
          { required: true, message: '请输入禁止原因' },
          { max: 100, message: '禁止原因不能超过 100 个字' },
        ],
        'x-component-props': {
          rows: 4,
        },
      },
    },
  },
};

import type { TSchemas } from '@/components/Business/Formily';

import { formTypes } from './Common';

// 恢复提现
export const resumeWithdrawalFields: TSchemas = {
  [formTypes.restoretWithdrawal]: {
    type: 'virtualBox',
    visible: false,
    properties: {
      walletId: {
        type: 'string',
        editable: false,
        default: '确认恢复提现？',
      },
    },
  },
};

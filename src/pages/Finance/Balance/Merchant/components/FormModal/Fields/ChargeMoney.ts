import { FormEffectHooks } from '@formily/antd';
import type { TSchemas } from '@/components/Business/Formily';
import { createLinkageUtils } from '@/components/Business/Formily';

import { cashTypeValueSchema, formTypes } from './Common';

import { onOpenModalFormByFormType$ } from '..';

const cashTypeMaps = {
  2: 'ADMIN_RECHARGE_WALLET',
  1: 'ADMIN_RECHARGE_PEAS',
};

export const useChargeMoneyEffects = () => {
  const linkage = createLinkageUtils({ fatherPath: formTypes.chargeMoney });

  onOpenModalFormByFormType$().subscribe((props) => {
    if (props.formType === formTypes.chargeMoney) {
      // linkage.value('cashTypeValue', 2);
      linkage.value('cashType', cashTypeMaps[2]);
    }
  });

  FormEffectHooks.onFieldInputChange$(`${formTypes.chargeMoney}.cashTypeValue`).subscribe(
    (fieldState) => {
      linkage.value('cashType', cashTypeMaps[fieldState.value]);
    },
  );
};

// 充值
export const chargeMoneyFields: TSchemas = {
  [formTypes.chargeMoney]: {
    type: 'virtualBox',
    visible: false,
    properties: {
      cashTypeValue: {
        title: '充值类型',
        default: 2,
        ...cashTypeValueSchema,
      },
      cashType: {
        type: 'string',
        display: false,
      },
      amount: {
        title: '充值金额',
        type: 'number',
        'x-component-props': {
          placeholder: '请输入充值金额（0.01 ~ 99999）',
          style: { width: '100%' },
          min: 0.01,
          max: 99999,
          precision: 2,
          step: 0.01,
        },
        'x-rules': {
          required: true,
          message: '请输入充值金额',
        },
      },

      remark: {
        title: '备注信息',
        type: 'textarea',
        'x-component-props': {
          placeholder: '必填，请说明原因，如转账凭证号等',
          rows: 4,
        },
        'x-rules': [
          { required: true, message: '请输入原因' },
          { max: 100, message: '原因不能超过 100 个字' },
        ],
      },
    },
  },
};

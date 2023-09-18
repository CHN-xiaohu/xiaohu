import { FormEffectHooks } from '@formily/antd';
import type { TSchemas } from '@/components/Business/Formily';
import { createLinkageUtils } from '@/components/Business/Formily';

import { cashTypeValueSchema, formTypes } from './Common';

import { onOpenModalFormByFormType$ } from '..';

const cashTypeMaps = {
  1: 'ADMIN_DEDUCTION_PEAS',
  2: 'ADMIN_DEDUCTION_WALLET',
};

const forFatherPath = (path: string) => `${formTypes.deductMoney}.${path}`;

export const useDeductMoneyEffects = () => {
  const linkage = createLinkageUtils({ fatherPath: formTypes.deductMoney });

  // 利用闭包临时储存的数据，用于下方更新
  let temporaryVariables = {
    itemData: {
      amount: 0,
      peas: 0,
    },
  };

  const setDataByCashTypeAndAmount = (cashType: string, amount: string | number) => {
    linkage.value('cashType', cashType);
    linkage.value('balance', amount);
    linkage.xComponentProp('amount', 'max', parseFloat(String(amount)));
  };

  onOpenModalFormByFormType$().subscribe((data) => {
    if (formTypes.deductMoney === data.formType) {
      setTimeout(() => {
        linkage.value('cashTypeValue', 2);

        setDataByCashTypeAndAmount(cashTypeMaps[1], data.itemData.amount);
      });
    }

    temporaryVariables = data;
  });

  FormEffectHooks.onFieldInputChange$(forFatherPath('cashTypeValue')).subscribe((fieldState) => {
    const amount =
      fieldState.value === 2
        ? temporaryVariables.itemData.amount
        : temporaryVariables.itemData.peas;

    setDataByCashTypeAndAmount(cashTypeMaps[fieldState.value], amount);
  });
};

// 扣钱
export const deductMoneyFields: TSchemas = {
  [formTypes.deductMoney]: {
    type: 'virtualBox',
    visible: false,
    properties: {
      cashTypeValue: {
        title: '扣钱类型',
        ...cashTypeValueSchema,
      },
      cashType: {
        type: 'string',
        display: false,
      },
      balance: {
        title: '余额',
        type: 'string',
        editable: false,
      },
      amount: {
        title: '扣钱金额',
        type: 'number',
        'x-component-props': {
          placeholder: '请输入扣钱金额',
          style: { width: '100%' },
          min: 0.01,
          max: 99999,
          precision: 2,
          step: 0.01,
        },
        'x-rules': {
          required: true,
          message: '请输入扣钱金额',
        },
      },
      remark: {
        title: '备注信息',
        type: 'textarea',
        'x-component-props': {
          placeholder: '必填，请说明原因',
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

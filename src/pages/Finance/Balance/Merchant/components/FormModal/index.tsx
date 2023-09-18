import { useCallback } from 'react';
import { createAsyncFormActions, createEffectHook } from '@formily/antd';
import {
  useModalForm,
  changeVisibleFormLayoutItemForLayerForm,
} from '@/components/Business/Formily';

import { transformToPenny } from '@/utils';

import { chargeMoneyFields, useChargeMoneyEffects } from './Fields/ChargeMoney';
import { deductMoneyFields, useDeductMoneyEffects } from './Fields/DeductMoney';
import { withdrawalProhibitedFields } from './Fields/WithdrawalProhibited';
import { resumeWithdrawalFields } from './Fields/ResumeWithdrawal';
import { formTypes } from './Fields/Common';

import type { IMerchantBalanceColumns } from '../../Api';
import { chargeMoney, deductMoney, prohibitWithdrawal, restoretWithdrawal } from '../../Api';

export type FormModalProps = {
  formType: keyof typeof formTypes;
  itemData: IMerchantBalanceColumns;
};

const formActions = createAsyncFormActions();
export const onOpenModalFormByFormType$ = createEffectHook<FormModalProps>(
  'onOpenModalFormByFormType',
);

export const useFormModal = ({ requestSuccess }: { requestSuccess: Function }) => {
  const { openModalForm, ModalFormElement } = useModalForm({
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
    actions: formActions,
    effects: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useDeductMoneyEffects();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useChargeMoneyEffects();
    },
    isNativeAntdStyle: true,
    schema: {
      ...chargeMoneyFields,
      ...deductMoneyFields,
      ...resumeWithdrawalFields,
      ...withdrawalProhibitedFields,
    },
  });

  const getTitleAndRequestMethod = (props: FormModalProps) => {
    switch (props.formType) {
      // 充值
      case formTypes.chargeMoney: {
        return {
          title: '余额充值',
          method: chargeMoney,
        };
      }

      // 扣钱
      case formTypes.deductMoney: {
        return {
          title: '扣钱',
          method: deductMoney,
        };
      }

      // 恢复提现
      case formTypes.restoretWithdrawal: {
        return {
          title: '提示',
          method: restoretWithdrawal,
        };
      }

      // 禁止提现
      default: {
        return {
          title: '禁止提现',
          method: prohibitWithdrawal,
        };
      }
    }
  };

  const handleSubmit = (method: Function, props: FormModalProps) => (
    values: Record<string, any>,
  ) => {
    delete values.balance;

    ['amount', 'peas'].forEach((k) => {
      if (values[k]) {
        values[k] = transformToPenny(values[k]);
      }
    });

    return method({ ...values, walletId: props.itemData.id }).then(() => {
      requestSuccess();
    });
  };

  const openFormModal = useCallback(
    (props: FormModalProps) => {
      const { title, method } = getTitleAndRequestMethod(props);

      changeVisibleFormLayoutItemForLayerForm(
        formActions,
        Object.keys(formTypes),
        props.formType,
      ).then(() => {
        formActions.dispatch('onOpenModalFormByFormType', props);
      });

      openModalForm({
        title,
        onSubmit: handleSubmit(method, props),
      });
    },
    [openModalForm],
  );

  return { ModalFormElement, openFormModal };
};

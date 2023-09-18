import { useModalForm } from '@/components/Business/Formily';
import { message, Modal } from 'antd';
import { useCallback } from 'react';

import { updateBatchStoreCommission } from '../../api';
import { commissionProps } from '../BusinessSetting';

type InitialValues = { ids: string[]; commission: number | string };

export function useSetCommissionForm(
  onSuccess: VoidFunction,
  createApi?: typeof updateBatchStoreCommission,
) {
  const { openModalForm, ModalFormElement } = useModalForm({
    title: '设置分佣比例',
    isNativeAntdStyle: true,
    onSubmit: (values) => {
      const ok = () =>
        (createApi || updateBatchStoreCommission)(values as InitialValues).then(onSuccess);

      if (!createApi) {
        // 需要进行再一次确认
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: '确定修改分佣比例吗？',
            onOk() {
              ok().then(resolve).catch(reject);
            },
            onCancel() {
              reject();
            },
          });
        });
      }

      return ok();
    },
    schema: {
      ids: {
        type: 'string',
        display: false,
      },
      commission: {
        title: '分佣比例',
        type: 'inputNumber',
        'x-component-props': {
          ...commissionProps(),
          style: {
            width: 125,
          },
        },
        'x-rules': {
          required: true,
          message: '请输入分佣比例',
        },
      },
    },
  });

  const openSetCommissionForm = useCallback((initialValues: Partial<InitialValues>) => {
    if (!initialValues.ids?.length) {
      message.error('请至少选择一个商家进行分佣比例设置');
      return;
    }

    openModalForm({
      initialValues: { ...initialValues },
    });
  }, []);

  return {
    openSetCommissionForm,
    ModalFormElement,
  };
}

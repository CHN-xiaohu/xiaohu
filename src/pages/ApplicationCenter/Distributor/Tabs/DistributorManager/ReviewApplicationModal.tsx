import { useModalForm } from '@/components/Business/Formily';
import { createAsyncFormActions } from '@formily/antd';
import { message } from 'antd';
import { useCallback } from 'react';

import { batchAuditDistributor } from '../../api';

const formActions = createAsyncFormActions();

export function useReviewApplicationModalForm(onSuccess: VoidFunction) {
  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    isNativeAntdStyle: true,
    onSubmit: (value) => batchAuditDistributor(value as any).then(onSuccess),
    schema: {
      ids: {
        type: 'string',
        display: false,
      },
      auditStatus: {
        type: 'number',
        display: false,
      },
      description: {
        type: 'string',
        editable: false,
        visible: false,
        default: '确定审核通过？',
      },
      auditMsg: {
        type: 'textarea',
        'x-component-props': {
          placeholder: '请输入拒绝通过的理由',
          rows: 4,
          showCount: true,
          maxLength: 30,
        },
        'x-rules': {
          required: true,
          message: '请输入拒绝通过的理由',
        },
      },
    },
  });

  const openReviewApplicationForm = useCallback(
    (values: { ids: string[]; auditStatus: 1 | 2; auditMsg?: string }) => {
      if (!values.ids?.length) {
        message.error('请勾选需要进行操作的用户');

        return;
      }

      const isOk = values.auditStatus === 1;

      openModalForm({
        title: isOk ? '提示' : '拒绝理由',
        initialValues: {
          ...values,
        },
      }).then(() => {
        formActions.setFieldState('description', (state) => {
          state.visible = isOk;
        });

        formActions.setFieldState('auditMsg', (state) => {
          state.visible = !isOk;
        });
      });
    },
    [],
  );

  return {
    openReviewApplicationForm,
    ModalFormElement,
  };
}

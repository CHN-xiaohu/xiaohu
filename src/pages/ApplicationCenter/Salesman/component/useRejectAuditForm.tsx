import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';
import { useRef } from 'react';

import { auditSalesmans } from '../Api';

type Props = {
  onAddSuccess: () => void;
  selectList: any[];
};

const formActions = createAsyncFormActions();

export const useRejectAuditForm = ({ onAddSuccess, selectList }: Props) => {
  const selectListCurrent = useRef([] as any);
  selectListCurrent.current = selectList;

  const handleSubmit = (values: any) => {
    values.auditStatus = 2;
    values.ids = selectListCurrent.current;
    return auditSalesmans(values).then(onAddSuccess);
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSubmit,
    actions: formActions,
    schema: {
      auditMsg: {
        title: '',
        type: 'textarea',
        'x-component-props': {
          placeholder: '请输入拒绝通过的理由（必填）',
          row: 4,
        },
        'x-rules': [
          { required: true, message: '请输入拒绝原因' },
          { max: 30, message: '原因不能超过30个字' },
        ],
      },
    },
  });

  const handleOpenForm = () => {
    openModalForm({
      title: '拒绝理由',
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};

import { useModalForm } from '@/components/Business/Formily';
import { registerFormField, connect, mapStyledProps, createAsyncFormActions } from '@formily/antd';

import { AuditTips } from '../component/AuditTips';

import { updateAuditIsOpen } from '../Api';

type Props = {
  onAddSuccess: () => void;
};

registerFormField(
  'auditTips',
  connect({
    getProps: mapStyledProps,
  })(AuditTips as any),
);

const formActions = createAsyncFormActions();

export const useAuditDeployForm = ({ onAddSuccess }: Props) => {
  const handleSubmit = (values: any) => updateAuditIsOpen(values.isOpen ? 0 : 1).then(onAddSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSubmit,
    actions: formActions,
    isNativeAntdStyle: true,
    schema: {
      isOpen: {
        title: '开启审核',
        type: 'boolean',
        'x-rules': {
          required: true,
        },
      },
      auditTips: {
        type: 'auditTips' as any,
      },
    },
  });

  const handleOpenForm = (initialValues: any = {}) => {
    formActions.setFieldValue('isOpen', initialValues.isOpen);

    openModalForm({
      title: '商家审核配置',
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};

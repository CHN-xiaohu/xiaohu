import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { submitAuditNoPass } from '../../Api/share';

type Props = {
  onAddSuccess: () => void;
  id: string;
};

const formActions = createAsyncFormActions();

export const useRefuseModal = ({ onAddSuccess, id }: Props) => {
  const handleRefuseAudit = (values: any) =>
    submitAuditNoPass({ id, ...values }).then(onAddSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleRefuseAudit,
    actions: formActions,
    schema: {
      auditContent: {
        title: '拒绝原因',
        type: 'textarea',
        'x-component-props': {
          placeholder: '请说明审核未通过原因',
          rows: 6,
        },
        'x-rules': [
          {
            required: true,
            message: '请输入备注, 上限100个字',
          },
          {
            range: [1, 100],
            message: '请输入备注, 上限100个字',
          },
        ],
      },
    },
  });

  const handleOpenForm = () => {
    openModalForm({
      title: '审核未通过',
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};

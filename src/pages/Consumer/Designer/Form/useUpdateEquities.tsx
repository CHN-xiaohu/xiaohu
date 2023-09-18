import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { message } from 'antd';

import { updateEquities } from '../Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const useUpdateEquities = ({ onAddSuccess }: Props) => {
  const handleCreateEquities = (values: any) =>
    updateEquities(values).then(() => {
      message.success('操作成功！');
      onAddSuccess();
    });

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreateEquities,
    actions: formActions,
    schema: {
      equities: {
        title: '账号权益',
        type: 'radio',
        default: 'TOURIST',
        enum: [
          { label: '游客', value: 'TOURIST' },
          { label: '设计师', value: 'STORE' },
        ],
      },
    },
  });

  const handleUpdateEquities = (initialValues: any = {}) => {
    openModalForm({
      title: '编辑权益',
      initialValues,
    });
  };

  return {
    openForm: handleUpdateEquities,
    ModalFormElement,
  };
};

import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { updateName } from '../Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const useEditName = ({ onAddSuccess }: Props) => {
  const handleSubmitUpdate = (values: any) => {
    return updateName(values).then(() => {
      setTimeout(() => {
        onAddSuccess();
      }, 1000);
    });
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSubmitUpdate,
    actions: formActions,
    schema: {
      name: {
        title: '',
        type: 'textarea',
        'x-component-props': {
          placeholder: '这是方案名称',
          rows: 3,
          maxLength: 30,
        },
      },
    },
  });

  const handleUpdateName = (initialValues: any = {}) => {
    openModalForm({
      title: '编辑方案',
      initialValues,
    });
  };

  return {
    openForm: handleUpdateName,
    ModalFormElement,
  };
};

import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

const formActions = createAsyncFormActions();

// type Props = {
//   onAddSuccess: () => void;
//   stores: any[];
// };

export const useEditForm = () => {
  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    schema: {
      registerPhone: {
        title: '注册手机号',
        type: 'string',
      },
      salesmanName: {
        title: '名称',
        type: 'string',
        'x-rules': {
          required: true,
        },
      },
      areas: {
        title: '所在地区',
        type: 'area',
      },
      inviteMan: {
        title: '邀请者',
        type: 'string',
        'x-rules': {
          required: true,
        },
        enum: [
          {
            value: '1',
            label: '平台',
          },
        ],
      },
      serviceArea: {
        title: '服务区域',
        type: 'string',
        enum: [{ label: '不知道啥', value: 1 }],
      },
    },
  });

  const handleOpenEditForm = (initialValues = {} as any) => {
    openModalForm({
      title: '编辑业务员',
      initialValues,
    });
  };

  return {
    openForm: handleOpenEditForm,
    ModalFormElement,
  };
};

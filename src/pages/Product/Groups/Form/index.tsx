import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { saveOrUpdatetGroups } from '../../Api/groups';

const formActions = createAsyncFormActions();

type Props = {
  onAddSuccess: () => void;
};

export const useGroupsForm = ({ onAddSuccess }: Props) => {
  const handleCreate = (values: any) => saveOrUpdatetGroups(values).then(onAddSuccess);

  const handleUpdate = (id: string, values: any) => saveOrUpdatetGroups(values).then(onAddSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    actions: formActions,
    isNativeAntdStyle: true,
    schema: {
      name: {
        type: 'string',
        title: '分组名称',
        'x-component-props': {
          placeholder: '请输入分组名称',
        },
        'x-rules': [
          {
            required: true,
            message: '请输入分组名称',
          },
          {
            pattern: /^.{1,10}$/,
            message: '名称不能超过 10 个字',
          },
        ],
      },
      serial: {
        title: '商品排序',
        type: 'number',
        description: '排序越小越靠前',
        'x-component-props': {
          placeholder: '请输入数字（0-999999）',
          max: 999999,
          min: 0,
          style: {
            width: '314px',
          },
        },
      },
    },
  });

  const handleOpenGroupsForm = (initialValues = {} as any) => {
    openModalForm({
      title: '新增/编辑分组',
      initialValues,
    });
  };
  return {
    openForm: handleOpenGroupsForm,
    ModalFormElement,
  };
};

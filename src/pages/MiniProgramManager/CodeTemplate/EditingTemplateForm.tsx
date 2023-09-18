import { useModalForm } from '@/components/Business/Formily';

export const useEditingTemplateForm = ({ title, onSubmit }: { title: string; onSubmit: any }) => {
  const handleSubmit = (values: any) => onSubmit(values);

  const { openModalForm, ModalFormElement } = useModalForm({
    isNativeAntdStyle: true,
    onSubmit: handleSubmit,
    schema: {
      id: {
        type: 'string',
        display: false,
      },
      type: {
        title: '模板类型',
        type: 'string',
        enum: [
          { label: '新零售直播版', value: '1' },
          { label: '新零售普通版', value: '2' },
        ],
        'x-rules': {
          required: true,
          message: '请选择模板类型',
        },
      },
      userDesc: {
        title: '版本描述',
        type: 'textarea',
        'x-component-props': {
          placeholder: '请输入版本描述',
          rows: 4,
        },
        'x-rules': {
          required: true,
          message: '请输入版本描述',
        },
      },
    },
  });

  const handleOpenForm = (initialValues = {} as any) => {
    openModalForm({
      title,
      initialValues: { ...initialValues },
    });
  };
  return {
    handleOpenForm,
    ModalFormElement,
  };
};

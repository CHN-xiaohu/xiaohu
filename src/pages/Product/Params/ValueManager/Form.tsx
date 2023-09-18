import { useCallback } from 'react';
import { useModalForm } from '@/components/Business/Formily';

import { nameSchema } from '../../Property/Common';
import type { PropertyValueColumns } from '../../Api';
import { savePropertyValue } from '../../Api';

type Props = {
  onSubmitSuccess: () => void;
};

export const usePropertyValueForm = ({ onSubmitSuccess }: Props) => {
  const handleSubmit = (values: any) =>
    savePropertyValue({
      propType: 1,
      ...values,
    }).then(onSubmitSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    onSubmit: handleSubmit,
    labelCol: { span: 6 },
    schema: {
      name: nameSchema('属性值名称', 50),
      serial: {
        title: '属性值排序',
        type: 'number',
        'x-component-props': {
          placeholder: '请输入属性值排序',
          max: 99999,
          min: 0,
        },
        'x-rules': {
          required: true,
          message: '请输入属性值排序',
        },
      },
      image: {
        title: '图片',
        type: 'uploadFile',
      },
    },
  });

  const openPropertyValueForm = useCallback((initialValues = {} as PropertyValueColumns) => {
    openModalForm({
      title: `${initialValues.id ? '编辑' : '新增'}参数值`,
      initialValues,
    });
  }, []);

  return { openPropertyValueForm, PropertyValueFormElement: ModalFormElement };
};

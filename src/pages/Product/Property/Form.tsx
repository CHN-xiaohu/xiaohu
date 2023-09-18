import { createAsyncFormActions, connect } from '@formily/antd';
import { useModalForm } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useEffect } from 'react';

import { EditableTagGroup } from '@/components/Library/EditableTagGroup';

import { isStr } from '@/utils';

import { nameSchema } from './Common';

import { saveProperty } from '../Api';

type Props = {
  onSubmitSuccess: () => void;
};

const formActions = createAsyncFormActions();

const fields = {
  editableTagGroup: connect()(EditableTagGroup),
};

export const usePropertyForm = ({ onSubmitSuccess }: Props) => {
  const { categories } = useStoreState('productCategory');

  const handleSubmit = (values: any) =>
    saveProperty({
      custom: 0,
      ...values,
      propVals: values.propVals?.map((val: string) => (isStr(val) ? { name: val } : val)),
      propType: 1,
      optionType: 2,
    }).then(onSubmitSuccess);

  useEffect(() => {
    setTimeout(() => {
      formActions.setFieldState('categoryId', (state) => {
        (state as any).props['x-component-props'].treeData = categories;
      });
    });
  }, [categories]);

  const { openModalForm, ModalFormElement } = useModalForm({
    onSubmit: handleSubmit,
    labelCol: { span: 5 },
    actions: formActions,
    fields,
    schema: {
      name: nameSchema('属性名称', 20),
      categoryId: {
        title: '所属类目',
        type: 'treeSelect',
        'x-component-props': {
          placeholder: '请选择所属类目',
          treeData: categories,
          allowClear: true,
        },
        'x-rules': {
          required: true,
          message: '请选择所属类目',
        },
      },
      propVals: {
        title: '属性值',
        type: 'editableTagGroup',
        required: true,
      },
      search: {
        title: '是否可搜索',
        type: 'checkableTags',
        'x-rules': {
          required: true,
          message: '请输入是否可搜索',
        },
        'x-component-props': {
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
      },
      custom: {
        title: '是否自定义',
        type: 'checkableTags',
        'x-rules': {
          required: true,
          message: '请输入是否自定义',
        },
        'x-component-props': {
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
      },
      required: {
        title: '是否必填',
        type: 'checkableTags',
        'x-rules': {
          required: true,
          message: '请输入是否必填',
        },
        'x-component-props': {
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
      },
      serial: {
        title: '属性排序',
        type: 'number',
        placeholder: '请输入属性排序',
        'x-component-props': {
          min: 0,
          max: 99999,
        },
        'x-rules': {
          required: true,
          message: '请输入属性排序',
        },
      },
    },
  });

  const openPropertyForm = (initialValues: any = {}) => {
    const isCreate = !initialValues.id;

    setTimeout(() => {
      formActions.setFieldState('categoryId', (state) => {
        state.editable = isCreate;
      });

      formActions.setFieldState('propVals', (state) => {
        state.display = isCreate;
      });
    });

    openModalForm({
      title: `${isCreate ? '新增' : '编辑'}属性`,
      initialValues: {
        custom: 0,
        search: 0,
        required: 0,
        propVals: undefined,
        ...initialValues,
      },
    });
  };

  return {
    openPropertyForm,
    PropertyFormElement: ModalFormElement,
  };
};

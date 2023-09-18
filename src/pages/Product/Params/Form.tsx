import { useModalForm } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { EditableTagGroup } from '@/components/Library/EditableTagGroup';

import { isStr } from '@/utils';

import { useEffect } from 'react';
import { createAsyncFormActions, connect } from '@formily/antd';

import { nameSchema } from '../Property/Common';

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
      ...values,
      propVals: values.propVals?.map((val: string) => (isStr(val) ? { name: val } : val)),
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
      name: nameSchema('参数名称', 50),
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
      optionType: {
        title: '选项类型',
        type: 'radioGroup',
        'x-rules': {
          required: true,
          message: '请选择选项类型',
        },
        'x-component-props': {
          dataSource: [
            { label: '下拉', value: 1 },
            { label: '多选', value: 2 },
            { label: '文本', value: 3 },
          ],
        },
        'x-linkages': [
          {
            type: 'value:effect',
            effect: ({ setFieldState }) => {
              setFieldState('optionType', (fieldState) => {
                const display = fieldState.value !== 3;

                setFieldState('propVals', (fstate) => {
                  if (!fstate.notChangeDisplay) {
                    fstate.display = display;
                  }
                });

                setFieldState('search', (fstate) => {
                  // https://www.tapd.cn/23571741/bugtrace/bugs/view/1123571741001004625
                  if (!display) {
                    fstate.value = 0;
                  }

                  fstate.display = display;
                });
              });
            },
          },
        ],
      },
      propVals: {
        title: '参数值',
        type: 'editableTagGroup',
        'x-rules': {
          required: true,
          message: '请添加参数值',
        },
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
        title: '参数排序',
        type: 'number',
        placeholder: '请输入参数排序',
        'x-component-props': {
          min: 0,
          max: 99999,
        },
        'x-rules': {
          required: true,
          message: '请输入参数排序',
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

      formActions.setFieldState('optionType', (state) => {
        state.editable = isCreate;
      });

      formActions.setFieldState('propVals', (state) => {
        state.display = isCreate;
        state.notChangeDisplay = !isCreate;
      });
    });

    openModalForm({
      title: `${isCreate ? '新增' : '编辑'}参数`,
      initialValues: {
        custom: 0,
        search: 0,
        required: 0,
        optionType: 1,
        propType: 2,
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

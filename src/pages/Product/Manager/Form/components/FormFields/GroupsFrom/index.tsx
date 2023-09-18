import { useModalForm } from '@/components/Business/Formily';
import { useRef } from 'react';

import { createAsyncFormActions } from '@formily/antd';
import { useGroupsToSelectOptions } from '@/pages/Product/useGroupsToSelectOptions';
import { bindingOrReplaceGroup } from '@/pages/Product/Api/groups';

export const stringFilterOption = (input: string, option: { props: { children: string } }) =>
  option.props.children.indexOf(input) > -1;

const formActions = createAsyncFormActions();

type Props = {
  onAddSuccess: () => void;
  productList: any[];
  productType: number;
};

export const useEditGroupsForm = ({ onAddSuccess, productList, productType }: Props) => {
  const { groupsSelectOptions } = useGroupsToSelectOptions();
  const productCurrent = useRef([] as any);
  const productTypeCurrent = useRef(0 as number);
  productCurrent.current = productList;
  productTypeCurrent.current = productType;

  const handleCreate = (values: any) => {
    values.productIds = productCurrent.current;
    values.productType = productTypeCurrent.current;
    return bindingOrReplaceGroup(values).then(onAddSuccess);
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreate,
    actions: formActions,
    isNativeAntdStyle: true,
    schema: {
      operationType: {
        title: '修改方式',
        type: 'radio',
        default: 1,
        enum: [
          {
            label: '新增（在原有分组基础上增加）',
            value: 1,
          },
          {
            label: '替换（以所选分组替换原有分组，不选即为取消原有分组）',
            value: 2,
          },
        ],
      },
      groupIds: {
        title: '选择分组',
        type: 'string',
        enum: groupsSelectOptions,
        'x-component-props': {
          filterOption: stringFilterOption,
          placeholder: '请选择分组',
          showSearch: true,
          mode: 'multiple',
        },
      },
    },
  });

  const handleOpenEditGroupsForm = (initialValues = {} as any) => {
    openModalForm({
      title: '修改分组',
      initialValues,
    }).then(() => {
      formActions.setFieldState('groupIds', (state) => {
        (state.props as any).enum = groupsSelectOptions;
      });
    });
  };
  return {
    openForm: handleOpenEditGroupsForm,
    ModalFormElement,
  };
};

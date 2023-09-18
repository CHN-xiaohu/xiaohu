import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';
import { useDebounceByMemo } from '@/foundations/hooks';

import type { PropertyColumns } from '../Api';
import { getProducts } from '../Api';

const formActions = createAsyncFormActions();

export const useRetweetProduct = (onSubmit: Function) => {
  const handleSubmit = (values: AnyObject) => {
    onSubmit(values);

    return Promise.resolve();
  };

  const changeLoading = () => {
    formActions.setFieldState('id', (state: any) => {
      state.props['x-component-props'].loading = !state.props['x-component-props'].loading;
    });
  };

  const handleSearch = (name: string) => {
    if (!name) {
      return;
    }

    changeLoading();

    getProducts({
      size: 100,
      current: 1,
      mini: 0,
      name,
    })
      .then((res) => {
        formActions.setFieldState('id', (state: any) => {
          const data = res.data.records as PropertyColumns[];

          state.props.enum = data.map((item) => ({ value: item.id, label: item.name }));
          state.props['x-component-props'].showArrow = !!data.length;
        });
      })
      .finally(() => {
        changeLoading();
      });
  };

  const handleSearchDebounce = useDebounceByMemo(handleSearch);

  const { openModalForm, ModalFormElement } = useModalForm({
    title: '同步采购商品至小程序',
    onSubmit: handleSubmit,
    actions: formActions,
    schema: {
      id: {
        title: '选择商品',
        type: 'string',
        enum: [],
        'x-component-props': {
          placeholder: '请输入商品名称进行检索',
          showSearch: true,
          onSearch: handleSearchDebounce,
          defaultActiveFirstOption: false,
          showArrow: false,
          filterOption: false,
          notFoundContent: null,
        },
        'x-rules': {
          required: true,
          message: '请输入商品名称',
        },
      },
    },
  });

  return {
    openRetweetProduct: openModalForm,
    RetweetProductElement: ModalFormElement,
  };
};

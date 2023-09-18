import { useMemo, useEffect, useCallback } from 'react';
import type { IFormAsyncActions } from '@formily/antd';

import type { TSchemas } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { getArrayLastItem } from '@/utils';
import type { TModelNamespace } from '@/pages/Product/index.d';

export const useCategoryLayoutBySchema = (
  formActions: IFormAsyncActions,
  modelNamespace: TModelNamespace = 'product',
): TSchemas => {
  const { categories } = useStoreState('productCategory');
  const { initialValues, currentStep, isShowEditCategoryPopconfirm } = useStoreState(
    modelNamespace as 'product',
  );

  useEffect(() => {
    formActions.setFieldState('categoryId', (fieldState) => {
      fieldState.props!['x-component-props']!.options = categories;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  useEffect(() => {
    const categoryId = getArrayLastItem(initialValues.categoryIds);

    formActions.setFieldValue('categoryId', initialValues.categoryIds);

    if (categoryId) {
      // 初始数据的分类 id 变动后，重新请求对应的参数、品牌数据列表
      window.$fastDispatch((model) => model[modelNamespace].requestProductParamsByCategoryId, {
        categoryId,
      });

      window.$fastDispatch((model) => model[modelNamespace].requestBrandsByCategoryId, {
        categoryId,
      });

      formActions.setFieldValue(
        'categoryBreadcrumb',
        initialValues.categoryIds.map((id: string, index: number) => ({
          label: initialValues[`category${index + 1}Name`],
          value: id,
        })),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues.categoryIds]);

  useEffect(() => {
    formActions.setFieldState('categoryBreadcrumb', (fieldState) => {
      fieldState.props!['x-component-props']!.currentStep = currentStep;
      fieldState.props![
        'x-component-props'
      ]!.isShowEditCategoryPopconfirm = isShowEditCategoryPopconfirm;
    });
  }, [currentStep, formActions, isShowEditCategoryPopconfirm]);

  const handleCheckFullValuesChange = useCallback(
    (values: any[]) => {
      formActions.setFieldValue('categoryBreadcrumb', values);

      window.$fastDispatch((model) => model[modelNamespace].updateState, {
        buttonGroupDisabled: values.length !== 3,
      });
    },
    [formActions, modelNamespace],
  );

  return useMemo(
    () => ({
      categoryLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '选择商品分类',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          categoryId: {
            type: 'columnSelect',
            // rules: [
            //   { required: true, message: '请选择商品分类' },
            //   { len: 3, message: '需要选择三级类目' },
            // ],
            'x-component-props': {
              placeholder: '请选择商品分类',
              showSearch: true,
              optionFilterProp: 'label',
              fieldNames: { label: 'name', value: 'id', children: 'children' },
              className: 'product-category__column-select',
              onCheckFullValuesChange: handleCheckFullValuesChange,
            },
          },
        },
      },
    }),
    [handleCheckFullValuesChange],
  );
};

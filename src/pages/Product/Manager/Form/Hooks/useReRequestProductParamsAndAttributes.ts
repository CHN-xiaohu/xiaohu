import { useRef } from 'react';
import type { IFormAsyncActions } from '@formily/antd';
import { getArrayLastItem } from '@/utils';
import type { TModelNamespace } from '@/pages/Product/index.d';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { usePersistFn } from 'ahooks';

import type { CategoryBreadcrumbProps } from '../components/FormFields/CategoryBreadcrumb';

export const useReRequestProductParamsAndAttributes = (
  formActions: IFormAsyncActions,
  modelNamespace: TModelNamespace = 'product',
) => {
  const previousCategoryIds = useRef<string[]>([]);
  const { initialValues } = useStoreState(modelNamespace);

  // 当分类发生变化时，并前进到第二 stpe 时，重新触发对应分类的所下属参数、规格的数据请求
  const handleReRequestProductParamsAndAttributes = usePersistFn(async () => {
    const categoryBreadcrumbValue: CategoryBreadcrumbProps['value'] = await formActions.getFieldValue(
      'categoryBreadcrumb',
    );

    if (categoryBreadcrumbValue?.length === 3) {
      const categoryIds = categoryBreadcrumbValue.map((item) => item.value);

      if (categoryIds.join('') !== previousCategoryIds.current.join('')) {
        previousCategoryIds.current = categoryIds;

        if (previousCategoryIds.current.length) {
          window.$fastDispatch(
            (model) => model[modelNamespace].resetRequestProductParamsAndAttributes,
            {
              categoryId: getArrayLastItem(categoryIds),
            },
          );

          window.$fastDispatch((model) => model[modelNamespace].updateState, {
            categoryIsReselected: initialValues.categoryIds.join('') !== categoryIds.join(''),
          });
        }
      }
    }
  });

  return {
    handleReRequestProductParamsAndAttributes,
    previousCategoryIds,
  };
};

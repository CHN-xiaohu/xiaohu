import { useMemo, useEffect } from 'react';
import type { TSchemas } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import type { IFormAsyncActions } from '@formily/antd';

import type { TModelNamespace } from '@/pages/Product/index.d';

export const useDetailLayoutBySchema = (
  formActions: IFormAsyncActions,
  modelNamespace: TModelNamespace = 'product',
): TSchemas => {
  const { initialValues } = useStoreState(modelNamespace);

  useEffect(() => {
    formActions.setFieldValue('*.*.detailLayout.introductions', initialValues.introductions);
  }, [initialValues.introductions]);

  return useMemo(
    () => ({
      type: 'object',
      'x-component': 'card',
      'x-component-props': {
        title: '商品详情',
        type: 'inner',
        className: 'product-detail-container',
      },
      properties: {
        introductions: {
          type: 'detailEditor',
        },
      },
    }),
    [],
  );
};

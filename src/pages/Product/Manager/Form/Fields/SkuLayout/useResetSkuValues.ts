import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useCallback, useRef } from 'react';
import type { IFormAsyncActions } from '@formily/antd';
import { resetFieldValue } from '@/components/Business/Formily';

import { useDebounceWatch } from '@/foundations/hooks';
import type { TModelNamespace } from '@/pages/Product/index.d';

import { clearSkuTableAllCache, clearSpecificationTable } from './effects';

import type { useHandleAttributeFormField } from './useHandleAttributeFormField';

import { specificationAttributesFormPath } from '.';

export type UseResetSkuValuesProps = {
  formActions: IFormAsyncActions;
  modelNamespace?: TModelNamespace;
  setDefaultCheckAttributes: ReturnType<
    typeof useHandleAttributeFormField
  >['setDefaultCheckAttributes'];
};

export const useResetSkuValues = ({
  formActions,
  modelNamespace = 'product',
  setDefaultCheckAttributes,
}: UseResetSkuValuesProps) => {
  const formatTabelDataSourceToDescarteDataOnce = useRef(false);
  const { reselectCategory } = useStoreState(modelNamespace);

  const clearSpecificationAttributes = useCallback(() => {
    formActions.setFormState((formState: any) => {
      if (formState.values.skuFullLayout) {
        formState.values.skuFullLayout.specificationAttributes = [];
      }
    });

    resetFieldValue({
      formActions,
      matchPath: [specificationAttributesFormPath, `${specificationAttributesFormPath}.*.*`],
    });
  }, []);

  useDebounceWatch(() => {
    // 如果还没有进行初次渲染，那么就直接冻结
    formatTabelDataSourceToDescarteDataOnce.current = true;

    clearSpecificationAttributes();

    clearSpecificationTable(formActions);

    clearSkuTableAllCache();

    setDefaultCheckAttributes((draft) => {
      draft.defaultCheckAttributes = {};
    });
  }, [reselectCategory]);

  return formatTabelDataSourceToDescarteDataOnce;
};
